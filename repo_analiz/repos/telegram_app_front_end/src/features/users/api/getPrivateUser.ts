import api from "@/features/axiosInstance";
import { User } from "../types";

export const getPrivateUser = async (userId: string) => {
  const { data } = await api.get<{data : User}>(`/users/private/${userId}`);
  return data.data;
};
