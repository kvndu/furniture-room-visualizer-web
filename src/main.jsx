import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DesignProvider } from "./context/DesignContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DesignProvider>
          <App />
        </DesignProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);