interface Corporate {
  corporate_id: string;
  code: string;
  name: string;
  address: string;
  phone: string | null;
}

export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  token: string;
  level: "ADMIN" | "CLIENT" | string;
  corporates: Corporate;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse {
  code: number;
  message: string;
  data: UserProfile;
}
