import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Optional Claude proxy endpoint for the AI features. Set VITE_API_URL at build/deploy time.
window.__ARTECO_API_URL__ = import.meta.env.VITE_API_URL || "";

createRoot(document.getElementById("root")).render(<App />);
