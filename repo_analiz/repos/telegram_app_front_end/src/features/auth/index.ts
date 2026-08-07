// src/features/auth/index.ts

// === API functions ===
export { sendVerification } from './api/existsVerification';
export { registerVerification } from './api/registerVerification';
export { sendOtp } from './api/sendOtp';

// === Hooks ===
export {
  useRegisterVerification,
  useSendOtp,
  type AuthHookOptions,
} from './hooks/useAuth';

// === Types ===
export type {
  ExistsVerificationDto,
  RegisterVerificationDto,
  OtpResponse,
  SendOtpDto,
} from './types';
