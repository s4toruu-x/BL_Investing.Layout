import { useEffect, memo, type FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { StockTicker } from "./StockTickerMarquee";
import { useSidebar } from "../../hooks/useSidebar";

const MemoOutlet = memo(() => <Outlet />);

const Layout: FC = () => {
  const { collapsed } = useSidebar(); // only Layout re-renders, not children
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 flex">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300
          ml-0 ${collapsed ? "md:ml-[60px]" : "md:ml-56"}
        `}
      >
        <StockTicker />

        <div className="flex-1 px-4 md:px-6 py-6 w-full max-w-[1400px] mx-auto">
          <MemoOutlet />
        </div>
      </div>
    </div>
  );
};

export { Layout };
