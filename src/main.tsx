import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import "leaflet/dist/leaflet.css";

async function init() {
  const { registerSW } = await import("virtual:pwa-register");

  registerSW({
    immediate: true,
  });

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </StrictMode>
  );
}

init();