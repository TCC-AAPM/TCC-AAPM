import "./assets/styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx"; 
import { DarkMode } from "./utils/darkMode.jsx";

createRoot(document.getElementById("root")).render(
  <DarkMode>
    <StrictMode>
      <App />
    </StrictMode>
  </DarkMode>,
);
