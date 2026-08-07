import api from "@/features/axiosInstance";
import { User } from "@/types/ui/user.types";

type subscriptionsType = {
    "subscriber": User,
    "chatId": string,
    "id": string
}

export const createChannelSubscription = async (chatId:string) => { const { data } = await api.post(`/channel-subscriptions/create/${chatId}`); return data; };
export const getMyChannelSubscriptions = async () => { const { data } = await api.get('/channel-subscriptions/my-subscriptions'); return data; };
export const getChatChannelSubscriptions = async (id:string) => { const { data } = await api.get<subscriptionsType[]>(`/channel-subscriptions/get-all/by-chatid/${id}`); return data; };
export const removeChannelSubscription = async (id:string) => { const { data } = await api.delete(`/channel-subscriptions/remove-one/by-subscriptionid/${id}`); return data; };
