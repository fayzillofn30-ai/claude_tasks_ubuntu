import api from "@/features/axiosInstance";
import { Chat } from "@/types/ui/chat.types";
export const getAllGroupsByOwner = async () => {
  const { data } = await api.get('/groupes/get-all/by-ownerid');
  return data;
};
export const getAllGroupes = async () => {
  const {data} = await api.get<{data : Chat[]}>('/groupes/get-all/groupes').then(res => res).catch(err => err);
  console.log(data)
  return data.data;
};
