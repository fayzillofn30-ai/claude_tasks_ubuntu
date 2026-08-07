import api from "@/features/axiosInstance";
import { UserChat } from "../types";
import { Chat } from "@/types/ui/chat.types";

export const createChat = async (user2Id: string) => {
  const { data } = await api.post<{chat : Chat}>(`/userchats/create/${user2Id}`);
  return data.chat;
};
