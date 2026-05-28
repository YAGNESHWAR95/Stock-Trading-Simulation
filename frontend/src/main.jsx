import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios' // 1. Import axios
import './index.css'
import App from './App.jsx'

// 2. Global configuration for Production (Cross-Domain Cookies)
// This is what prevents the "Unauthorized" error by allowing 
// Vercel to send the JWT token to Render.
axios.defaults.withCredentials = true;

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('Service worker registered.'))
      .catch((err) => console.warn('Service worker registration failed:', err));
  });
}
