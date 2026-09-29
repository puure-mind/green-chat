"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthCredentials } from "@/shared/types/auth";

export type AuthStatus = "initializing" | "authenticated" | "unauthenticated";

type AuthState = {
  credentials: AuthCredentials | null;
  hasHydrated: boolean;
  status: AuthStatus;
  setCredentials: (credentials: AuthCredentials) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setStatus: (status: AuthStatus) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      credentials: null,
      hasHydrated: false,
      status: "initializing",
      setCredentials: (credentials) =>
        set({
          credentials: {
            idInstance: credentials.idInstance.trim(),
            apiTokenInstance: credentials.apiTokenInstance.trim(),
          },
          status: "authenticated",
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setStatus: (status) => set({ status }),
      logout: () => set({ credentials: null, status: "unauthenticated" }),
    }),
    {
      name: "green-chat-auth",
      partialize: (state) => ({ credentials: state.credentials }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
