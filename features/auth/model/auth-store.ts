"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthCredentials, AuthSession } from "@/shared/types/auth";

type AuthState = {
  session: AuthSession | null;
  setSession: (credentials: AuthCredentials) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (credentials) =>
        set({
          session: {
            idInstance: credentials.idInstance.trim(),
            apiTokenInstance: credentials.apiTokenInstance.trim(),
            authorizedAt: new Date().toISOString(),
          },
        }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: "green-chat-auth",
    },
  ),
);
