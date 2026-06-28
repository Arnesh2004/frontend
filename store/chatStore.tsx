"use client";

import { socket } from "@/lib/socket";
import React, { createContext, useContext, useEffect, useState } from "react";

/* =========================
   TYPES
========================= */

type Message = {
  id: string;
  text: string;
  sender: string;
};

type Chat = {
  id: string;
  name: string;
  lastMessage: string; // ✅ FIXED (required by ChatSidebar)
  messages: Message[];
};

type ChatContextType = {
  chats: Chat[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  sendMessage: (msg: string) => void;
};

/* =========================
   CONTEXT
========================= */

const ChatContext = createContext<ChatContextType | null>(null);

/* =========================
   PROVIDER
========================= */

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeChatId, setActiveChatId] = useState("1");

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "Arjun",
      lastMessage: "",
      messages: [],
    },
    {
      id: "2",
      name: "Priya",
      lastMessage: "",
      messages: [],
    },
  ]);

  /* =========================
     SOCKET CONNECT
  ========================= */

  useEffect(() => {
    socket.auth = {
      token: localStorage.getItem("token"),
    };

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join_chat", activeChatId);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  /* =========================
     JOIN CHAT ROOM ON SWITCH
  ========================= */

  useEffect(() => {
    if (!socket.connected) return;

    socket.emit("join_chat", activeChatId);
  }, [activeChatId]);

  /* =========================
     RECEIVE MESSAGE
  ========================= */

  useEffect(() => {
    const handler = (data: any) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== data.chatId) return chat;

          const newMessage = {
            id: data.id,
            text: data.message,
            sender: data.sender,
          };

          const updatedMessages = [...chat.messages, newMessage];

          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: data.message, // ✅ FIXED HERE
          };
        })
      );
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, []);

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessage = (message: string) => {
    if (!activeChatId || !message.trim()) return;

    const tempId = `${Date.now()}-${Math.random()}`;

    socket.emit("send_message", {
      chatId: activeChatId,
      message,
    });

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat;

        const updatedMessages = [
          ...chat.messages,
          {
            id: tempId,
            text: message,
            sender: "me",
          },
        ];

        return {
          ...chat,
          messages: updatedMessages,
          lastMessage: message, // ✅ FIXED HERE
        };
      })
    );
  };

  /* =========================
     PROVIDER VALUE
  ========================= */

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        setActiveChatId,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};