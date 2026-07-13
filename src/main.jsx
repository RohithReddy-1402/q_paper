import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Home from './components/HomePage.jsx'
import QuestionPaper from './components/QuestionPaper.jsx'
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </HelmetProvider>,
)
