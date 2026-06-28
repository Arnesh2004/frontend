export type Message = {
  id: string;
  sender: "me" | "other";
  text: string;
  timestamp: string;
};