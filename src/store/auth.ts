import type { UserProfile } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (userData: UserProfile) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,

      login: (userData) =>
        set({
          isLoggedIn: true,
          user: userData,
          token: userData.token,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
