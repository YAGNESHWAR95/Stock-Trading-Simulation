import axios from "axios";

// Clean base URL without any '/api' extensions
const defaultBackendUrl = "https://stock-trading-simulation-ld2b.onrender.com";
const apiURL = import.meta.env.VITE_BACKEND_URL || defaultBackendUrl;

const baseAPI = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export default baseAPI;