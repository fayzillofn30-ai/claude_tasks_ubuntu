import { create } from "zustand";

type VerificationUrlState = {
  verificationUrl: string | null;
  targetUrlAfterOtp: string | null;
  setVerifyUrl: (value: string | null) => void;
  setTargetUrlAfterOtp: (value: string | null) => void;
  reset: () => void;
};

export const useVerificationUrlStore = create<VerificationUrlState>((set) => ({
  verificationUrl: null,
  targetUrlAfterOtp: null,

  setVerifyUrl: (value) =>
    set(() => ({
      verificationUrl: value,
    })),

  setTargetUrlAfterOtp: (value) =>
    set(() => ({
      targetUrlAfterOtp: value,
    })),

  reset: () =>
    set(() => ({
      verificationUrl: null,
      targetUrlAfterOtp: null,
    })),
}));
