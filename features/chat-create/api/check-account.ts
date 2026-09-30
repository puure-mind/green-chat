import { apiClient } from "@/shared/api/client";
import type { AuthCredentials } from "@/shared/types/auth";

export type CheckAccountResult = {
  chatId: string;
  existsWhatsapp: boolean;
  fromCache: boolean;
  phoneNumber: string;
  username: string;
};

type CheckAccountResponse = {
  chatId?: string;
  existsWhatsapp: boolean;
  fromCache?: boolean;
  phoneNumber?: string;
  username?: string;
};

export async function checkAccount({
  chatId,
  credentials,
}: {
  chatId: string;
  credentials: AuthCredentials;
}): Promise<CheckAccountResult> {
  const response = await apiClient.post<CheckAccountResponse>(
    `/waInstance${credentials.idInstance}/checkWhatsapp/${credentials.apiTokenInstance}`,
    { chatId, force: true },
  );

  return {
    chatId: response.data.chatId ?? chatId,
    existsWhatsapp: response.data.existsWhatsapp,
    fromCache: response.data.fromCache ?? false,
    phoneNumber: response.data.phoneNumber ?? chatId,
    username: response.data.username ?? "",
  };
}
