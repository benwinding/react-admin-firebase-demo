import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// remove the service worker registered by older builds
navigator.serviceWorker
  ?.getRegistrations()
  .then((registrations) => registrations.forEach((r) => r.unregister()));

createRoot(document.getElementById("root")).render(<App />);
