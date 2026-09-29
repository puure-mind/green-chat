"use client";

import { useEffect } from "react";
import { checkAuthCredentials } from "../api/check-auth";
import { isInvalidCredentialsError } from "../model/auth-errors";
import { useAuthStore } from "../model/auth-store";
import { AuthForm } from "./auth-form";
import { ChatShell } from "@/widgets/chat-shell/ui/chat-shell";

function AuthLoading() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#e7f8ee] px-4">
      <div className="rounded-[2rem] border border-emerald-100 bg-white/95 px-8 py-7 text-center shadow-2xl shadow-emerald-950/10">
        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
        <p className="text-sm font-medium text-slate-950">
          Проверяем авторизацию
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Это займет несколько секунд.
        </p>
      </div>
    </main>
  );
}

function AuthScreen() {
  return (
    <main className="flex min-h-svh items-center justify-center overflow-hidden bg-[#e7f8ee] px-4 py-10">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-300/40 blur-3xl" />
      <div className="relative grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_28rem]">
        <section className="hidden lg:block">
          <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-lg font-bold text-slate-950">
                GC
              </div>
              <div>
                <p className="text-sm text-emerald-200">Green Chat</p>
                <p className="text-xs text-slate-400">messenger dashboard</p>
              </div>
            </div>
            <h2 className="mt-14 max-w-md text-5xl font-semibold leading-tight tracking-tight">
              Быстрый вход в мессенджер через Green API.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-slate-400">
              После проверки учетные данные сохраняются локально и открывают
              основную часть приложения.
            </p>
          </div>
        </section>
        <AuthForm />
      </div>
    </main>
  );
}

function AuthVerificationFailed({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#e7f8ee] px-4">
      <div className="max-w-md rounded-[2rem] border border-amber-100 bg-white/95 px-8 py-7 text-center shadow-2xl shadow-emerald-950/10">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-600">
          Green Chat
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
          Не удалось проверить авторизацию
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Мы сохранили данные входа. Проверьте подключение или доступность Green
          API и повторите проверку.
        </p>
        <button
          className="mt-6 h-12 rounded-2xl bg-emerald-500 px-6 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
          onClick={onRetry}
          type="button"
        >
          Повторить
        </button>
      </div>
    </main>
  );
}

export function AuthGate() {
  const credentials = useAuthStore((state) => state.credentials);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);
  const retryVerification = useAuthStore((state) => state.retryVerification);
  const setStatus = useAuthStore((state) => state.setStatus);
  const verificationAttempt = useAuthStore(
    (state) => state.verificationAttempt,
  );

  useEffect(() => {
    let isActive = true;

    async function initializeAuth() {
      if (!hasHydrated) {
        return;
      }

      if (status === "authenticated") {
        return;
      }

      setStatus("initializing");

      if (credentials === null) {
        setStatus("unauthenticated");
        return;
      }

      try {
        await checkAuthCredentials(credentials);

        if (isActive) {
          setStatus("authenticated");
        }
      } catch (error) {
        if (isActive) {
          if (isInvalidCredentialsError(error)) {
            logout();
            return;
          }

          setStatus("verification-failed");
        }
      }
    }

    initializeAuth();

    return () => {
      isActive = false;
    };
  }, [
    credentials,
    hasHydrated,
    logout,
    setStatus,
    status,
    verificationAttempt,
  ]);

  if (status === "initializing") {
    return <AuthLoading />;
  }

  if (status === "authenticated") {
    return <ChatShell />;
  }

  if (status === "verification-failed") {
    return <AuthVerificationFailed onRetry={retryVerification} />;
  }

  return <AuthScreen />;
}
