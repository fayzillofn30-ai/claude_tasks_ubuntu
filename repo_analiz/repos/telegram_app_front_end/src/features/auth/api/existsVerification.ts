import api from "@/features/axiosInstance";
import { ExistsVerificationDto } from "../types";

export const sendVerification = async (payload: ExistsVerificationDto,url :string) => {
  const sessionToken = localStorage.getItem("sessionToken")
  const { data } = await api.post(url, payload, {
    headers : {
      Authorization : `Bearer ${sessionToken}`
    }
  });
  return data;
};
