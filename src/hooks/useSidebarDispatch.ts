import { useContext } from "react";
import { SidebarDispatchContext } from "../provider/SidebarProvider";

export const useSidebarDispatch = () => useContext(SidebarDispatchContext);
