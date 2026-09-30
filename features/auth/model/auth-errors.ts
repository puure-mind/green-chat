import { AxiosError } from "axios";

export const unknownUserMessage =
  "Пользователь с такими idInstance и apiTokenInstance не найден.";

export function isInvalidCredentialsError(error: unknown) {
  if (!(error instanceof AxiosError)) {
    return false;
  }

  return (
    error.response?.status === 401 ||
    error.response?.status === 403 ||
    error.response?.status === 404
  );
}

export function getAuthErrorMessage(error: unknown) {
  if (isInvalidCredentialsError(error)) {
    return unknownUserMessage;
  }

  return "Не удалось проверить данные. Проверьте idInstance, apiTokenInstance и повторите попытку.";
}
