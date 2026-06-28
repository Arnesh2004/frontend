export type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
};

export type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  messages: Message[];
};