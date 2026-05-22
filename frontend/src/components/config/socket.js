import { io } from "socket.io-client";

// Update the URL below if your backend is hosted elsewhere
const SOCKET_URL = "http://localhost:5000"; 

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Connected explicitly on user authentication login
});