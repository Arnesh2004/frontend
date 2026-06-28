"use client";

import { useChat } from "@/store/chatStore";
import { useState } from "react";

export default function ChatWindow() {
  const { chats, activeChatId, sendMessage } = useChat();
  const [text, setText] = useState("");

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">

      {/* HEADER */}
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">
          {activeChat?.name || "Chat"}
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {activeChat?.messages?.length ? (
          activeChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === activeChat?.name ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words ${
                  msg.sender === activeChat?.name
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {/* sender label */}
                <div className="text-xs opacity-60 mb-1">
                  {msg.sender}
                </div>

                {msg.text}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-10">
            No messages yet
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t bg-white flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Write a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 rounded-full"
        >
          Send
        </button>
      </div>

    </div>
  );
}