"use client";

import { AuthForm } from "@/features/auth/ui/auth-form";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { ChatShell } from "@/widgets/chat-shell/ui/chat-shell";

export default function Home() {
  const session = useAuthStore((state) => state.session);

  if (session !== null) {
    return <ChatShell />;
  }

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
