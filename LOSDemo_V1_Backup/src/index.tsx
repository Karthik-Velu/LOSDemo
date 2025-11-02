import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ESign } from "./screens/ESign";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ESign />
  </StrictMode>,
);
