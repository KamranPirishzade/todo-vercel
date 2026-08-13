import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.functional";
import "./index.css";

// Apply env class to <body> so CSS can target it
const env = import.meta.env.VITE_APP_ENV ?? "development";
document.body.classList.add(`env-${env}`);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
