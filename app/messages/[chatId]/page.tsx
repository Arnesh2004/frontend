"use client";


type Message = {
  id: string;
  text: string;
  sender: string;
};

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  messages: Message[];
};

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
}: ChatSidebarProps) {
  return (
    <div className="w-1/3 border-r p-4 bg-white overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`p-3 cursor-pointer rounded mb-2 ${
            activeChatId === chat.id ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <div className="font-semibold">{chat.name}</div>
          <div className="text-sm text-gray-500 truncate">
            {chat.lastMessage}
          </div>
        </div>
      ))}
    </div>
  );
}