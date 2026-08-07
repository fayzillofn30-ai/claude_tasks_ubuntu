import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import * as sendApi from "../api/sendOtp";
import * as registerApi from "../api/registerVerification";
import * as existsApi from "../api/existsVerification";
import type { SendOtpDto } from "../types";

// 📘 1. OTP yuborish
export const useSendOtp = (
  options?: UseMutationOptions<any, Error, SendOtpDto>
) =>
  useMutation({
    mutationFn: (payload: SendOtpDto) => sendApi.sendOtp(payload),
    ...options,
  });

// 📘 2. Ro‘yxatdan o‘tishni tasdiqlash
export const useRegisterVerification = (options?: UseMutationOptions<any, Error, any>) =>
  useMutation({
    mutationFn: (payload: any) => registerApi.registerVerification(payload),
    ...options,
  });

// 📘 3. Foydalanuvchi mavjudligini tekshirish

// 📘 4. Yordamchi tur (agar tashqarida ishlatilsa)
export type AuthHookOptions = UseMutationOptions<any, Error, any>;
