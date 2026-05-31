import { io } from "socket.io-client";

const defaultBackendUrl = "http://localhost:4000";
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || defaultBackendUrl;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});