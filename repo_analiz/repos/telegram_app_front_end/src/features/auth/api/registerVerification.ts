import api from "@/features/axiosInstance";
import { RegisterVerificationDto } from "../types";

export const registerVerification = async (payload: RegisterVerificationDto) => {
  const { data } = await api.post('/auth/register/verification', payload);
  return data;
};
