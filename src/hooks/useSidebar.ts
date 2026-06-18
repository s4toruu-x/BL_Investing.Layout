import { useSidebarDispatch } from "./useSidebarDispatch";
import { useSidebarState } from "./useSidebarState";

export const useSidebar = () => ({
  ...useSidebarState(),
  ...useSidebarDispatch(),
});
