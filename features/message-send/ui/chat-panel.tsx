"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useEffect, useRef, useState } from "react";
import { sendMessage } from "../api/send-message";
import { validateMessageText } from "../model/message-validation";
import type {
  Chat,
  ChatMessage,
} from "@/features/chat-create/model/chat-store";
import { useChatStore } from "@/features/chat-create/model/chat-store";
import type { AuthCredentials } from "@/shared/types/auth";

type ChatPanelProps = {
  chat: Chat | undefined;
  credentials: AuthCredentials | null;
};

const EMPTY_MESSAGES: ChatMessage[] = [];

function createLocalMessage(chatId: string, text: string): ChatMessage {
  const createdAt = Date.now();

  return {
    chatId,
    createdAt,
    direction: "outgoing",
    id: `local-${createdAt}-${crypto.randomUUID()}`,
    status: "pending",
    text,
  };
}

function formatMessageTime(timestamp: number) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Не удалось отправить сообщение.";
}

function MessageBubble({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry: (message: ChatMessage) => void;
}) {
  const isOutgoing = message.direction === "outgoing";

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-[1.4rem] px-4 py-2 shadow-lg ${
          isOutgoing ? "rounded-br-md" : "rounded-bl-md"
        } ${
          message.status === "failed"
            ? "bg-red-500/15 text-red-50 shadow-red-950/20 ring-1 ring-red-400/25"
            : isOutgoing
              ? "bg-emerald-400 text-slate-950 shadow-emerald-950/20"
              : "bg-slate-800 text-white shadow-slate-950/20"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-6">
          {message.text}
        </p>
        <div
          className={`mt-1 flex items-center justify-end gap-2 text-[0.68rem] ${
            message.status === "failed"
              ? "text-red-100"
              : isOutgoing
                ? "text-slate-700"
                : "text-slate-400"
          }`}
        >
          <span>{formatMessageTime(message.createdAt)}</span>
          {isOutgoing ? (
            <span>
              {message.status === "pending"
                ? "отправка"
                : message.status === "sent"
                  ? "✓✓"
                  : "ошибка"}
            </span>
          ) : null}
        </div>
        {message.status === "failed" && isOutgoing ? (
          <button
            className="mt-2 rounded-full bg-red-400/20 px-3 py-1 text-xs font-semibold text-red-50 transition hover:bg-red-400/30"
            onClick={() => onRetry(message)}
            type="button"
          >
            Повторить
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ChatPanel({ chat, credentials }: ChatPanelProps) {
  const [messageText, setMessageText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const addOptimisticMessage = useChatStore(
    (state) => state.addOptimisticMessage,
  );
  const markMessageFailed = useChatStore((state) => state.markMessageFailed);
  const markMessageSent = useChatStore((state) => state.markMessageSent);
  const messages = useChatStore((state) =>
    chat === undefined
      ? EMPTY_MESSAGES
      : (state.messages[chat.id] ?? EMPTY_MESSAGES),
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMutation = useMutation({
    mutationFn: async (message: ChatMessage) => {
      if (credentials === null) {
        throw new Error("Авторизация не найдена.");
      }

      const response = await sendMessage({
        chatId: message.chatId,
        credentials,
        message: message.text,
      });

      return { message, response };
    },
    onError: (error, message) => {
      markMessageFailed({
        chatId: message.chatId,
        errorMessage: getErrorMessage(error),
        messageId: message.id,
      });
    },
    onSuccess: ({ message, response }) => {
      markMessageSent({
        chatId: message.chatId,
        messageId: message.id,
        serverId: response.idMessage,
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (chat === undefined) {
      return;
    }

    const validationMessage = validateMessageText(messageText);

    if (validationMessage.length > 0) {
      setErrorMessage(validationMessage);
      return;
    }

    const message = createLocalMessage(chat.id, messageText.trim());

    setErrorMessage("");
    setMessageText("");
    addOptimisticMessage(message);
    sendMutation.mutate(message);
  }

  function retryMessage(message: ChatMessage) {
    const retry = createLocalMessage(message.chatId, message.text);

    addOptimisticMessage(retry);
    sendMutation.mutate(retry);
  }

  if (chat === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/15 text-2xl text-emerald-200">
            GC
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Выберите или создайте чат
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Введите номер в сайдбаре, чтобы создать чат и отправить сообщение.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_36%),#0f172a]">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {messages.length === 0 ? (
            <div className="mx-auto mt-12 max-w-sm rounded-3xl border border-white/10 bg-slate-950/60 px-5 py-4 text-center text-sm leading-6 text-slate-400">
              История сообщений пока пуста. Напишите первое сообщение.
            </div>
          ) : null}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onRetry={retryMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        className="border-t border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur sm:px-6"
        onSubmit={submitMessage}
      >
        <div className="mx-auto max-w-3xl">
          {errorMessage.length > 0 ? (
            <p className="mb-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
              {errorMessage}
            </p>
          ) : null}
          <div className="flex items-end gap-2 rounded-[1.7rem] bg-white/10 p-2">
            <textarea
              className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-5 text-white outline-none placeholder:text-slate-500"
              placeholder="Сообщение"
              rows={1}
              value={messageText}
              onChange={(event) => {
                setMessageText(event.target.value);
                setErrorMessage("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-lg font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              disabled={messageText.trim().length === 0}
              type="submit"
            >
              ↑
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
