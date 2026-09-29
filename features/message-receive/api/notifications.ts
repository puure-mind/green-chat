import { apiClient } from "@/shared/api/client";
import type { AuthCredentials } from "@/shared/types/auth";

export type IncomingMessageNotification = {
  idMessage: string;
  instanceData?: {
    wid?: string;
  };
  messageData?: {
    textMessageData?: {
      textMessage?: string;
    };
    typeMessage?: string;
  };
  senderData?: {
    chatId?: string;
    sender?: string;
    chatName?: string;
    senderContactName?: string;
    senderName?: string;
    senderPhoneNumber?: number | string;
  };
  timestamp?: number;
  typeWebhook?: string;
};

export type GreenApiNotification = {
  body?: IncomingMessageNotification;
  receiptId: number;
};

export async function receiveNotification(credentials: AuthCredentials) {
  const response = await apiClient.get<GreenApiNotification | null | "">(
    `/waInstance${credentials.idInstance}/receiveNotification/${credentials.apiTokenInstance}`,
    {
      params: {
        receiveTimeout: 5,
      },
    },
  );

  return response.data || null;
}

export async function deleteNotification({
  credentials,
  receiptId,
}: {
  credentials: AuthCredentials;
  receiptId: number;
}) {
  await apiClient.delete(
    `/waInstance${credentials.idInstance}/deleteNotification/${credentials.apiTokenInstance}/${receiptId}`,
  );
}
