"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { checkAccount } from "../api/check-account";
import {
  getPhoneFromChatId,
  normalizePhoneInput,
  validatePhoneNumber,
} from "@/features/user-search/model/phone";
import type { AuthCredentials } from "@/shared/types/auth";

type ChatCreateFormProps = {
  credentials: AuthCredentials | null;
  onCreateChat: (params: {
    chatId: string;
    phone: string;
    title: string;
  }) => void;
};

export function ChatCreateForm({
  credentials,
  onCreateChat,
}: ChatCreateFormProps) {
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const checkAccountMutation = useMutation({
    mutationFn: async (submittedPhone: string) => {
      if (credentials === null) {
        throw new Error("Авторизация не найдена.");
      }

      return checkAccount({
        chatId: `${submittedPhone}@c.us`,
        credentials,
      });
    },
    onError: () => {
      setErrorMessage("Не удалось проверить пользователя. Попробуйте еще раз.");
    },
    onSuccess: (result, submittedPhone) => {
      if (!result.existsWhatsapp) {
        setErrorMessage("Пользователь с таким номером не найден.");
        return;
      }

      const phoneFromResponse = getPhoneFromChatId(result.phoneNumber);

      setErrorMessage("");
      onCreateChat({
        chatId: result.chatId,
        phone:
          phoneFromResponse.length > 0 ? phoneFromResponse : submittedPhone,
        title: result.username || phoneFromResponse || submittedPhone,
      });
      setPhone("");
    },
  });

  return (
    <section className="mt-6">
      <form
        className="rounded-3xl bg-white/5 p-3"
        onSubmit={(event) => {
          event.preventDefault();

          const validationMessage = validatePhoneNumber(phone);

          if (validationMessage.length > 0) {
            setErrorMessage(validationMessage);
            return;
          }

          setErrorMessage("");
          checkAccountMutation.mutate(normalizePhoneInput(phone));
        }}
      >
        <label className="text-xs font-medium text-slate-400" htmlFor="phone">
          Новый чат
        </label>
        <div className="mt-2 flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/10"
            id="phone"
            inputMode="tel"
            placeholder="79001234567"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setErrorMessage("");
              checkAccountMutation.reset();
            }}
          />
          <button
            className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            disabled={checkAccountMutation.isPending}
            type="submit"
          >
            {checkAccountMutation.isPending ? "..." : "Создать"}
          </button>
        </div>
      </form>

      {errorMessage.length > 0 ? (
        <p className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
