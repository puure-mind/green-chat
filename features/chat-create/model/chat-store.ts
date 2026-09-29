"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Chat = {
  id: string;
  lastMessageAt: number | null;
  phone: string;
  title: string;
};

export type MessageStatus = "pending" | "sent" | "failed";

export type ChatMessage = {
  chatId: string;
  createdAt: number;
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

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      messages: {},
      selectedChatId: null,
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
              { id: chatId, lastMessageAt: null, phone, title },
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
      selectChat: (chatId) => set({ selectedChatId: chatId }),
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
