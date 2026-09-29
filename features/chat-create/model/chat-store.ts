"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Chat = {
  id: string;
  phone: string;
};

type ChatState = {
  chats: Chat[];
  selectedChatId: string | null;
  createChat: (phone: string) => void;
  selectChat: (chatId: string) => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      selectedChatId: null,
      createChat: (phone) =>
        set((state) => {
          const id = `${phone}@c.us`;
          const existingChat = state.chats.find((chat) => chat.id === id);

          if (existingChat !== undefined) {
            return { selectedChatId: existingChat.id };
          }

          return {
            chats: [{ id, phone }, ...state.chats],
            selectedChatId: id,
          };
        }),
      selectChat: (chatId) => set({ selectedChatId: chatId }),
    }),
    {
      name: "green-chat-chats",
      partialize: (state) => ({
        chats: state.chats,
        selectedChatId: state.selectedChatId,
      }),
    },
  ),
);
