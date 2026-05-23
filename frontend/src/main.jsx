import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios' // 1. Import axios
import './index.css'
import App from './App.jsx'

// 2. Global configuration for Production (Cross-Domain Cookies)
// This is what prevents the "Unauthorized" error by allowing 
// Vercel to send the JWT token to Render.
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)