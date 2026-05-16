// Determines the base URL depending on the environment
const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:4000" 
  : "https://your-production-backend-url.vercel.app"; // Replace with your actual deployed URL

export default BASE_URL;