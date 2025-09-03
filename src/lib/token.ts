import type { JwtPayload } from "@/types/types";
import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decodedToken: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};
