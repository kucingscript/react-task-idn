import type { UserProfile } from "@/types/user";
import apiClient from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: UserProfile;
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<ApiResponse> => {
  const res = await apiClient.post<ApiResponse>("/auth/login", credentials);
  return res.data;
};
