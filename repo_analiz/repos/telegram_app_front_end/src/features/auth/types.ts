export interface SendOtpDto {
  email: string;
}

export interface OtpResponse {
  success: boolean;
  message?: string;
}

export interface RegisterVerificationDto {
  phoneOrEmail: string;
  code: string;
}

export interface ExistsVerificationDto {
  email: string;
  code : string
}
