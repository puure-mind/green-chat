"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Chat = {
  id: string;
  lastMessageAt: number | null;
  phone: string;
  title: string;
  unreadCount: number;
};

export type MessageStatus = "pending" | "sent" | "failed";
export type MessageDirection = "incoming" | "outgoing";

export type ChatMessage = {
  chatId: string;
  createdAt: number;
  direction: MessageDirection;
  errorMessage?: string;
  id: string;
  serverId?: string;
  status: MessageStatus;
  text: string;
};

type ChatState = {
  chats: Chat[];
  messages: Record<string, ChatMessage[]>;
  selectedChatId: string | null;
  addIncomingMessage: (params: {
    chatId: string;
    createdAt: number;
    direction: MessageDirection;
    messageId: string;
    selectedChatId: string | null;
    senderName: string;
    senderPhone: string;
    text: string;
  }) => void;
  addOptimisticMessage: (message: ChatMessage) => void;
  createChat: (params: {
    chatId: string;
    phone: string;
    title: string;
  }) => void;
  markMessageFailed: (params: {
    chatId: string;
    errorMessage: string;
    messageId: string;
  }) => void;
  markMessageSent: (params: {
    chatId: string;
    messageId: string;
    serverId: string;
  }) => void;
  selectChat: (chatId: string) => void;
};

function moveChatToTop(chats: Chat[], chatId: string, lastMessageAt: number) {
  const chat = chats.find((item) => item.id === chatId);

  if (chat === undefined) {
    return chats;
  }

  return [
    { ...chat, lastMessageAt },
    ...chats.filter((item) => item.id !== chatId),
  ];
}

function ensureChat({
  chatId,
  chats,
  senderName,
  senderPhone,
}: {
  chatId: string;
  chats: Chat[];
  senderName: string;
  senderPhone: string;
}) {
  const existingChat = chats.find((chat) => chat.id === chatId);

  if (existingChat !== undefined) {
    return chats;
  }

  return [
    {
      id: chatId,
      lastMessageAt: null,
      phone: senderPhone,
      title: senderName || senderPhone || chatId,
      unreadCount: 0,
    },
    ...chats,
  ];
}

function getPhoneFromChatId(chatId: string) {
  return chatId.replace(/@c\.us$|@lid$/u, "").replace(/\D/g, "");
}

function resolveChatId({
  chatId,
  chats,
  senderPhone,
}: {
  chatId: string;
  chats: Chat[];
  senderPhone: string;
}) {
  const directChat = chats.find((chat) => chat.id === chatId);

  if (directChat !== undefined) {
    return directChat.id;
  }

  const phone = senderPhone || getPhoneFromChatId(chatId);
  const phoneChat = chats.find((chat) => chat.phone === phone);

  return phoneChat?.id ?? chatId;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      messages: {},
      selectedChatId: null,
      addIncomingMessage: ({
        chatId,
        createdAt,
        direction,
        messageId,
        selectedChatId,
        senderName,
        senderPhone,
        text,
      }) =>
        set((state) => {
          const resolvedChatId = resolveChatId({
            chatId,
            chats: state.chats,
            senderPhone,
          });
          const currentMessages = state.messages[resolvedChatId] ?? [];

          if (
            currentMessages.some((message) => message.serverId === messageId)
          ) {
            return state;
          }

          const isSelectedChat = selectedChatId === resolvedChatId;
          const shouldIncrementUnread =
            direction === "incoming" && !isSelectedChat;
          const chats = moveChatToTop(
            ensureChat({
              chatId: resolvedChatId,
              chats: state.chats,
              senderName,
              senderPhone,
            }),
            resolvedChatId,
            createdAt,
          ).map((chat) =>
            chat.id === resolvedChatId
              ? {
                  ...chat,
                  title: chat.title || senderName || senderPhone || chatId,
                  unreadCount: shouldIncrementUnread
                    ? chat.unreadCount + 1
                    : chat.unreadCount,
                }
              : chat,
          );

          return {
            chats,
            messages: {
              ...state.messages,
              [resolvedChatId]: [
                ...currentMessages,
                {
                  chatId: resolvedChatId,
                  createdAt,
                  direction,
                  id: `incoming-${messageId}`,
                  serverId: messageId,
                  status: "sent",
                  text,
                },
              ],
            },
          };
        }),
      addOptimisticMessage: (message) =>
        set((state) => ({
          chats: moveChatToTop(state.chats, message.chatId, message.createdAt),
          messages: {
            ...state.messages,
            [message.chatId]: [
              ...(state.messages[message.chatId] ?? []),
              message,
            ],
          },
        })),
      createChat: ({ chatId, phone, title }) =>
        set((state) => {
          const existingChat = state.chats.find((chat) => chat.id === chatId);

          if (existingChat !== undefined) {
            return { selectedChatId: existingChat.id };
          }

          return {
            chats: [
              { id: chatId, lastMessageAt: null, phone, title, unreadCount: 0 },
              ...state.chats,
            ],
            selectedChatId: chatId,
          };
        }),
      markMessageFailed: ({ chatId, errorMessage, messageId }) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] ?? []).map((message) =>
              message.id === messageId
                ? { ...message, errorMessage, status: "failed" }
                : message,
            ),
          },
        })),
      markMessageSent: ({ chatId, messageId, serverId }) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] ?? []).map((message) =>
              message.id === messageId
                ? { ...message, serverId, status: "sent" }
                : message,
            ),
          },
        })),
      selectChat: (chatId) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
          ),
          selectedChatId: chatId,
        })),
    }),
    {
      name: "green-chat-chats",
      partialize: (state) => ({
        chats: state.chats,
        messages: state.messages,
        selectedChatId: state.selectedChatId,
      }),
    },
  ),
);
