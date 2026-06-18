// SidebarContext.tsx
import { createContext, useState, type FC } from "react";
import type { WithChildren } from "../types/types";

const SidebarStateContext = createContext({ collapsed: false });
const SidebarDispatchContext = createContext({
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  setCollapsed: (_: boolean | ((_: boolean) => boolean)) => {},
});

const SidebarProvider: FC<WithChildren> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarDispatchContext.Provider value={{ setCollapsed }}>
      <SidebarStateContext.Provider value={{ collapsed }}>
        {children}
      </SidebarStateContext.Provider>
    </SidebarDispatchContext.Provider>
  );
};

export { SidebarProvider, SidebarStateContext, SidebarDispatchContext };
