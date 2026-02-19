import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.jsx'
import studyApi from "./services/studyApi";
import { Analytics } from '@vercel/analytics/react';

window.studyApi = studyApi;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
