import React from 'react';
import { createRoot } from "react-dom/client";
import { Toaster } from 'sonner';
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("CRASH: Could not find <div id='root'> in index.html");
} else {
  createRoot(rootElement).render(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
      <Toaster position="bottom-right" richColors />
    </ThemeProvider>
  );
}