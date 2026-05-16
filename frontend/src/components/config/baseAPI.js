// Determines the base URL depending on the environment
const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:4000" 
  : "https://stock-trading-simulation-ld2b.onrender.com"; // Your live Render backend

export default BASE_URL;