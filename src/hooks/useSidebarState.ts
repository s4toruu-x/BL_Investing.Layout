import { useContext } from "react";
import { SidebarStateContext } from "../provider/SidebarProvider";

export const useSidebarState = () => useContext(SidebarStateContext);
