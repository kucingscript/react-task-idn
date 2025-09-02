import type { ApiResponse, LoginCredentials } from "@/types/user";
import apiClient from "./api";

export const loginUser = async (
  credentials: LoginCredentials
): Promise<ApiResponse> => {
  const res = await apiClient.post<ApiResponse>("/login", credentials);
  return res.data;
};
