import type { IncomingMessageNotification } from "../api/notifications";
import type { MessageDirection } from "@/features/chat-create/model/chat-store";

export type ParsedIncomingMessage = {
  chatId: string;
  createdAt: number;
  direction: MessageDirection;
  messageId: string;
  senderName: string;
  senderPhone: string;
  text: string;
};

export function parseIncomingMessage(
  notification: IncomingMessageNotification | undefined,
): ParsedIncomingMessage | null {
  if (notification === undefined) {
    return null;
  }

  const isIncoming = notification.typeWebhook === "incomingMessageReceived";
  const isSelfOutgoing =
    notification.typeWebhook === "outgoingMessageReceived" &&
    notification.senderData?.sender === notification.instanceData?.wid &&
    notification.senderData?.chatId === notification.instanceData?.wid;

  if (!isIncoming && !isSelfOutgoing) {
    return null;
  }

  const chatId = notification.senderData?.chatId ?? "";
  const text = notification.messageData?.textMessageData?.textMessage ?? "";

  if (chatId.length === 0 || text.length === 0) {
    return null;
  }

  return {
    chatId,
    createdAt: (notification.timestamp ?? Math.floor(Date.now() / 1000)) * 1000,
    direction: isSelfOutgoing ? "outgoing" : "incoming",
    messageId: notification.idMessage,
    senderName:
      notification.senderData?.senderContactName ||
      notification.senderData?.senderName ||
      notification.senderData?.chatName ||
      "",
    senderPhone: String(notification.senderData?.senderPhoneNumber ?? ""),
    text,
  };
}
