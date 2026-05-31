import { io } from "socket.io-client";

const defaultBackendUrl = "https://stock-trading-simulation-ld2b.onrender.com";
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || defaultBackendUrl;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});