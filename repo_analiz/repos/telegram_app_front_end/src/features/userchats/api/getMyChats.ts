import api from "@/features/axiosInstance";
import { UserChat } from "../types";
import { Chat } from "@/types/ui/chat.types";

export const getMyChats = async () => {
  const { data } = await api.get<{data : Chat[]}>('/userchats/my-chats');
  console.log(data)
  return data.data || [];
};
