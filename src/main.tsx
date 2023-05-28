import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { CurrentWorkoutSessionProvider } from "./context/CurrentWorkoutSessionContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <CurrentWorkoutSessionProvider>
        <App />
      </CurrentWorkoutSessionProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
