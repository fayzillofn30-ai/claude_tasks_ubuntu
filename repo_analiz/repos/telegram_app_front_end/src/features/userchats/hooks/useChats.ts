import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import * as api from "../api/getMyChats";
import { useSocketStore } from "@/service/socket.io";
import { useEffect } from "react";

export const useMyChats = (options?: UseQueryOptions<any, Error>) => {
  const { socket } = useSocketStore();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["userchats", "my"],
    queryFn: api.getMyChats,
    enabled: !!socket,
    staleTime: 1000 * 60, // 1 daqiqa kechikish
    ...options,
  });

  // 🔹 Socket eventlarni tinglash
  useEffect(() => {
    if (!socket) return;

    // 🔸 Yangi chat qo‘shilganida
    socket.on("new-chat", (newChat) => {
      qc.setQueryData(["userchats", "my"], (old: any) => {
        if (!old) return [newChat];
        // Agar allaqachon mavjud bo‘lmasa, qo‘shamiz
        const exists = old.some((chat: any) => chat.id === newChat.id);
        return exists ? old : [...old, newChat];
      });
    });

    // 🔸 Chat yangilanganida
    socket.on("update-chat", (updatedChat) => {
      qc.setQueryData(["userchats", "my"], (old: any) => {
        if (!old) return [];
        return old.map((chat: any) =>
          chat.id === updatedChat.id ? updatedChat : chat
        );
      });
    });

    // 🔸 Chat o‘chirilganida
    socket.on("delete-chat", (deletedChat) => {
      qc.setQueryData(["userchats", "my"], (old: any) => {
        if (!old) return [];
        return old.filter((chat: any) => chat.id !== deletedChat.id);
      });
    });

    // cleanup
    return () => {
      socket.off("new-chat");
      socket.off("update-chat");
      socket.off("delete-chat");
    };
  }, [socket, qc]);

  return query;
};
