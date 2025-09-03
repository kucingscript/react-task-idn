import type { LoginResponse, LoginCredentials } from "@/types/user";
import apiClient from "./api";

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const res = await apiClient.post<LoginResponse>("/login", credentials);
  return res.data;
};
