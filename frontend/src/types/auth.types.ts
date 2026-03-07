// frontend/src/types/auth.types.ts
export const UserRole = {
  DENTIST: 'DENTIST',
  ADMIN: 'ADMIN',
  ASSISTANT: 'ASSISTANT',
  PATIENT: 'PATIENT'
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface DentistProfile {
  license_number: string;
  specialization?: string;
  clinic_name?: string;
  clinic_address?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  profile?: DentistProfile;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
  profile?: DentistProfile;
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
  login: (email: string, password: string) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}