"use client";

import { useEffect, useRef } from "react";
import { deleteNotification, receiveNotification } from "../api/notifications";
import { parseIncomingMessage } from "../model/notification-parser";
import { useChatStore } from "@/features/chat-create/model/chat-store";
import type { AuthCredentials } from "@/shared/types/auth";

const POLLING_INTERVAL_MS = 60_000;

type MessagePollerProps = {
  credentials: AuthCredentials | null;
};

export function MessagePoller({ credentials }: MessagePollerProps) {
  const isRequestActiveRef = useRef(false);
  const addIncomingMessage = useChatStore((state) => state.addIncomingMessage);

  useEffect(() => {
    if (credentials === null) {
      return;
    }

    const activeCredentials = credentials;
    let isMounted = true;

    async function poll() {
      if (isRequestActiveRef.current) {
        return;
      }

      isRequestActiveRef.current = true;

      try {
        const notification = await receiveNotification(activeCredentials);

        if (!isMounted || notification === null) {
          return;
        }

        const message = parseIncomingMessage(notification.body);

        if (message !== null) {
          addIncomingMessage({
            ...message,
            selectedChatId: useChatStore.getState().selectedChatId,
          });
        }

        await deleteNotification({
          credentials: activeCredentials,
          receiptId: notification.receiptId,
        });
      } finally {
        isRequestActiveRef.current = false;
      }
    }

    void poll();

    const intervalId = window.setInterval(poll, POLLING_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [addIncomingMessage, credentials]);

  return null;
}
