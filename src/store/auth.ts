import type { UserProfile } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
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

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
