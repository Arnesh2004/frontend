"use client";

import { useChat } from "@/store/chatStore";

export default function ChatSidebar() {
  const { chats, activeChatId, setActiveChatId } = useChat();

  return (
    <div className="w-[340px] h-screen bg-white border-r flex flex-col">

      {/* HEADER */}
      <div className="h-14 flex items-center px-6 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600">
        Nexus Chats
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`px-4 py-4 cursor-pointer transition border-b ${
              activeChatId === chat.id
                ? "bg-gray-100 border-l-4 border-indigo-600"
                : "hover:bg-gray-50"
            }`}
          >

            <div className="font-semibold text-gray-800">
              {chat.name}
            </div>

            <div className="text-sm text-gray-500 truncate">
              {chat.lastMessage}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}