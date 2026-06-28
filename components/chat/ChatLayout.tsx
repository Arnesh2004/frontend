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

interface ChatWindowProps {
  chat: Chat | undefined;
}

export default function ChatWindow({ chat }: ChatWindowProps) {
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Header */}
      <div className="border-b pb-2 mb-4">
        <h2 className="text-xl font-semibold">{chat.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded w-fit max-w-xs ${
              msg.sender === "me"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}