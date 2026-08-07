import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import * as api from "../api";
import { useEffect } from "react";
import { useSocketStore } from "@/service/socket.io";
import { Message } from "@/types/ui/message.types";

// 🔹 SOCKET bilan React Query ni umumlashtirish
export const useAllMessages = <T>(
  type: string,
  chatId: string,
  options?: UseQueryOptions<any, Error>
) => {
  const qc = useQueryClient();
  const { socket } = useSocketStore();

  const query = useQuery({
    queryKey: ["messages", type, chatId],
    queryFn: () => api.getMessages(chatId, type),
    enabled: !!chatId,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    ...options,
  });

  // 🔸 Socket eventlar bilan React Query cache ni yangilash
  useEffect(() => {
    if (!socket || !chatId) return;

    const addMsg = (msg: Message) => {
      if (msg.message.chatId !== chatId) return;
      qc.setQueryData(["messages", type, chatId], (old: any) => {
        if (!old) return [msg];
        const exists = old.some(
          (m: Message) => m.message.id === msg.message.id
        );
        if (exists) return old;
        return [...old, msg];
      });
    };

    const delMsg = (msg: Message) => {
      if (msg.message.chatId !== chatId) return;
      qc.setQueryData(["messages", type, chatId], (old: any) => {
        if (!old) return old;
        return old.filter(
          (m: Message) => m.message.id !== msg.message.id
        )
      });
    };

    const updMsg = (msg: Message) => {
      if (msg.message.chatId !== chatId) return;
      qc.setQueryData(["messages", type, chatId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          messages: old.messages.map((m: Message) =>
            m.message.id === msg.message.id ? msg : m
          ),
        };
      });
    };

    socket.on("create-msg", addMsg);
    socket.on("del-msg", delMsg);
    socket.on("update-msg", updMsg);

    return () => {
      socket.off("create-msg", addMsg);
      socket.off("del-msg", delMsg);
      socket.off("update-msg", updMsg);
    };
  }, [socket, chatId, type, qc]);
  const {data,...result} = query
  return {data : data ? data as T : [],...result};
};
