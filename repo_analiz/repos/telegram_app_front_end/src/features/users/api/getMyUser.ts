import api from "@/features/axiosInstance";
import { User } from "../types";

export const getMyUser = async () => {
  const { data } = await api.get<User>('/users/my');
  return data;
};
