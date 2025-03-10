import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";

const root = document.getElementById("root");

if (!root) {
  throw new Error("No root element found");
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider attribute={"class"}>
      <Theme accentColor="grass">
        <App />
      </Theme>
    </ThemeProvider>
  </StrictMode>
);
