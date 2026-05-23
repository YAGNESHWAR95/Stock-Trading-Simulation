import axios from "axios";

// Clean base URL without any '/api' extensions
const apiURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const baseAPI = axios.create({
  baseURL: apiURL,
  withCredentials: true 
});

export default baseAPI;