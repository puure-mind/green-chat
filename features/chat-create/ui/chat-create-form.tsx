"use client";

import { useState } from "react";
import {
  normalizePhoneInput,
  validatePhoneNumber,
} from "@/features/user-search/model/phone";

type ChatCreateFormProps = {
  onCreateChat: (phone: string) => void;
};

export function ChatCreateForm({ onCreateChat }: ChatCreateFormProps) {
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
          onCreateChat(normalizePhoneInput(phone));
          setPhone("");
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
            }}
          />
          <button
            className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            type="submit"
          >
            Создать
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
