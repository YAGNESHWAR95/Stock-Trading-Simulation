import { io } from "socket.io-client";

const defaultBackendUrl = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:4000"
  : "https://stock-trading-simulation-ld2b.onrender.com";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || defaultBackendUrl;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});