import { apiClient } from "@/shared/api/client";
import type { AuthCredentials } from "@/shared/types/auth";

type SendMessageResponse = {
  idMessage: string;
};

export async function sendMessage({
  chatId,
  credentials,
  message,
}: {
  chatId: string;
  credentials: AuthCredentials;
  message: string;
}) {
  const response = await apiClient.post<SendMessageResponse>(
    `/waInstance${credentials.idInstance}/sendMessage/${credentials.apiTokenInstance}`,
    { chatId, message },
  );

  return response.data;
}
