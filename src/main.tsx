import "./App.css";
import { createRoot } from "react-dom/client";
import { AppRouting } from "./AppRouting";
import { DarkModeProvider } from "./provider/DarkModeProvider";
import { SidebarProvider } from "./provider/SidebarProvider";

createRoot(document.getElementById("root")!).render(
  <DarkModeProvider>
    <SidebarProvider>
      <AppRouting />
    </SidebarProvider>
  </DarkModeProvider>,
);
