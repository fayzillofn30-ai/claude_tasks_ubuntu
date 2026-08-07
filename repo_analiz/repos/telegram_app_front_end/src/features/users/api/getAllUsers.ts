import api from "@/features/axiosInstance";
import { User } from "../types";

export const getAllUsers = async () => {
  const { data } = await api.get<{data :User[]}>('/users/get-all');
  return data.data;
};
