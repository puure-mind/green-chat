"use client";

import { useAuthStore } from "@/features/auth/model/auth-store";
import { ChatCreateForm } from "@/features/chat-create/ui/chat-create-form";
import { useChatStore } from "@/features/chat-create/model/chat-store";

export function ChatShell() {
  const credentials = useAuthStore((state) => state.credentials);
  const logout = useAuthStore((state) => state.logout);
  const chats = useChatStore((state) => state.chats);
  const createChat = useChatStore((state) => state.createChat);
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const selectChat = useChatStore((state) => state.selectChat);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  return (
    <main className="flex min-h-svh w-full bg-slate-950 p-3 text-white sm:p-6">
      <section className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/60">
        <aside className="hidden w-80 border-r border-white/10 bg-slate-950/80 p-4 md:block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">
                Green Chat
              </p>
              <h2 className="mt-2 text-xl font-semibold">Чаты</h2>
            </div>
            <button
              className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-emerald-300 hover:text-emerald-200"
              onClick={logout}
              type="button"
            >
              Выйти
            </button>
          </div>
          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-slate-300">Аккаунт подключен</p>
            <p className="mt-1 truncate text-sm font-medium text-white">
              {credentials?.idInstance}
            </p>
          </div>
          <ChatCreateForm onCreateChat={createChat} />
          <div className="mt-5 space-y-2">
            {chats.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-center text-sm text-slate-500">
                Создайте чат по номеру телефона
              </p>
            ) : null}
            {chats.map((chat) => (
              <button
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                  chat.id === selectedChatId
                    ? "bg-emerald-300 text-slate-950"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                type="button"
              >
                <span className="block text-sm font-semibold">
                  +{chat.phone}
                </span>
                <span
                  className={`mt-1 block text-xs ${
                    chat.id === selectedChatId
                      ? "text-slate-700"
                      : "text-slate-500"
                  }`}
                >
                  Чат создан
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-h-[calc(100svh-1.5rem)] flex-1 flex-col sm:min-h-[calc(100svh-3rem)]">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-sm text-slate-400">
                {selectedChat === undefined
                  ? "Основная часть приложения"
                  : "Чат"}
              </p>
              <h1 className="text-lg font-semibold">
                {selectedChat === undefined
                  ? "Добро пожаловать"
                  : `+${selectedChat.phone}`}
              </h1>
            </div>
            <button
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 md:hidden"
              onClick={logout}
              type="button"
            >
              Выйти
            </button>
          </header>

          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/15 text-2xl text-emerald-200">
                GC
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {selectedChat === undefined
                  ? "Авторизация выполнена"
                  : "Чат готов"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {selectedChat === undefined
                  ? "Введите номер в сайдбаре, чтобы создать чат без проверки регистрации пользователя."
                  : "Следующим use-case можно подключать поле ввода и отправку сообщений."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
