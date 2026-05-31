import axios from "axios";

const defaultBackendUrl = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:4000"
  : "https://stock-trading-simulation-ld2b.onrender.com";

const apiURL = import.meta.env.VITE_BACKEND_URL || defaultBackendUrl;

const baseAPI = axios.create({
  baseURL: apiURL,
  withCredentials: true 
});

export default baseAPI;