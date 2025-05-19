import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { initialiseState } from "./state/stateInitialiser";

// state is not bound to react anymore so we can initialise it here
// ore anywhere we want to
initialiseState();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
