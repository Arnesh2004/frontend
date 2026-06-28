import { io } from "socket.io-client";

// Get JWT token from localStorage (only in browser)
const token =
  typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

export const socket = io("http://localhost:3001", {
  autoConnect: false,
  transports: ["websocket", "polling"],

  auth: {
    token,
  },
});