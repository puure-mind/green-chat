"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { checkAuthCredentials } from "../api/check-auth";
import { useAuthStore } from "../model/auth-store";
import type { AuthCredentials } from "@/shared/types/auth";

const unknownUserMessage =
  "Пользователь с такими idInstance и apiTokenInstance не найден.";

function getAuthErrorMessage(error: unknown) {
  if (error instanceof AxiosError && error.response?.status === 401) {
    return unknownUserMessage;
  }

  if (error instanceof AxiosError && error.response?.status === 403) {
    return unknownUserMessage;
  }

  if (error instanceof AxiosError && error.response?.status === 404) {
    return unknownUserMessage;
  }

  return "Не удалось проверить данные. Проверьте idInstance, apiTokenInstance и повторите попытку.";
}

export function AuthForm() {
  const saveCredentials = useAuthStore((state) => state.setCredentials);
  const [credentials, setCredentials] = useState<AuthCredentials>({
    idInstance: "",
    apiTokenInstance: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const authMutation = useMutation({
    mutationFn: checkAuthCredentials,
    onSuccess: (_settings, submittedCredentials) => {
      setErrorMessage("");
      saveCredentials(submittedCredentials);
    },
    onError: (error) => {
      setErrorMessage(getAuthErrorMessage(error));
    },
  });

  const isSubmitDisabled =
    authMutation.isPending ||
    credentials.idInstance.trim().length === 0 ||
    credentials.apiTokenInstance.trim().length === 0;

  return (
    <form
      className="w-full max-w-md rounded-[2rem] border border-emerald-100 bg-white/95 p-6 shadow-2xl shadow-emerald-950/10 backdrop-blur sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        authMutation.mutate({
          idInstance: credentials.idInstance,
          apiTokenInstance: credentials.apiTokenInstance,
        });
      }}
    >
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-emerald-600">
          Green Chat
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Вход в аккаунт
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Введите данные из личного кабинета Green API, чтобы открыть
          мессенджер.
        </p>
      </div>

      <label
        className="block text-sm font-medium text-slate-700"
        htmlFor="idInstance"
      >
        idInstance
      </label>
      <input
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        id="idInstance"
        name="idInstance"
        placeholder="1101123456"
        value={credentials.idInstance}
        onChange={(event) =>
          setCredentials((current) => ({
            ...current,
            idInstance: event.target.value,
          }))
        }
      />

      <label
        className="mt-5 block text-sm font-medium text-slate-700"
        htmlFor="apiTokenInstance"
      >
        apiTokenInstance
      </label>
      <input
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        id="apiTokenInstance"
        name="apiTokenInstance"
        placeholder="Ваш токен"
        type="password"
        value={credentials.apiTokenInstance}
        onChange={(event) =>
          setCredentials((current) => ({
            ...current,
            apiTokenInstance: event.target.value,
          }))
        }
      />

      {errorMessage.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <button
        className="mt-7 h-12 w-full rounded-2xl bg-emerald-500 px-5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        disabled={isSubmitDisabled}
        type="submit"
      >
        {authMutation.isPending ? "Проверяем..." : "Войти"}
      </button>
    </form>
  );
}
