// patient-portal/src/types/auth.types.ts
export const UserRole = {
  PATIENT: 'patient'
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  is_email_verified: boolean;
  created_at: string;
}

export interface ForgotPasswordRequest {
  email: string;
  role: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
