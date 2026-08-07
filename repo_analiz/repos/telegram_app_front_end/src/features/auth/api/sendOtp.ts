import api from "@/features/axiosInstance";
import { SendOtpDto } from "../types";

export const sendOtp = async (payload: SendOtpDto) => {
  const { data } = await api.post('/auth/send-otp', payload);
  return data;
};
