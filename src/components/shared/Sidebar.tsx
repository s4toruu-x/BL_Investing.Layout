import { useState, type FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import BlueLockInvestingLogoDark from "../../assets/bl_investing_logo_dark.png";
import BlueLockInvestingLogoLight from "../../assets/bl_investing_logo_light.png";
import BlueLockInvestingIconDark from "../../assets/bl_investing_icon_dark.png";
import BlueLockInvestingIconLight from "../../assets/bl_investing_icon_light.png";
import { ThemeToggle } from "./ThemeToggle";
import { FaHome } from "react-icons/fa";
import { FiChevronLeft, FiMenu, FiX } from "react-icons/fi";
import { useDarkMode } from "../../hooks/useDarkMode";

const navItems = [{ icon: FaHome, label: "Home", to: "/", end: true }];

const Sidebar: FC = () => {
  const { isDark } = useDarkMode();
  const { collapsed, setCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useNavigate();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="fixed top-3 left-3 z-50 md:hidden w-8 h-8 rounded-lg
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          flex items-center justify-center shadow-sm cursor-pointer"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <FiX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <FiMenu className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700/60
        z-40 transition-all duration-300 ease-in-out
        w-56 md:translate-x-0
        ${collapsed ? "md:w-[60px]" : "md:w-56"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700/60 flex-shrink-0 overflow-hidden px-3">
          <img
            src={
              collapsed
                ? isDark
                  ? BlueLockInvestingIconDark
                  : BlueLockInvestingIconLight
                : isDark
                  ? BlueLockInvestingLogoDark
                  : BlueLockInvestingLogoLight
            }
            alt="Blue Lock Investing"
            className={`object-contain cursor-pointer transition-all duration-300
  ${collapsed ? "md:h-10 h-11" : "h-11"}
`}
            onClick={() => {
              nav("/");
              setMobileOpen(false);
            }}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-2 mb-2">
              Menu
            </p>
          )}
          {navItems.map(({ icon: Icon, label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150
        ${collapsed ? "md:w-9 md:h-9 md:p-0 md:justify-center md:mx-auto" : ""}
        ${
          isActive
            ? "bg-blue-50 dark:bg-blue-700/20 text-blue-700 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
        }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-700 dark:text-blue-400" : ""}`}
                  />
                  <span className={collapsed ? "md:hidden" : ""}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700/60 flex flex-col gap-2">
          <ThemeToggle collapsed={collapsed} />
        </div>
      </aside>

      {/* Desktop collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`hidden md:flex fixed top-[52px] z-50 w-5 h-5 rounded-full
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          items-center justify-center shadow-sm hover:shadow-md
          transition-all duration-300 ease-in-out cursor-pointer
          ${collapsed ? "left-[48px]" : "left-[212px]"}
        `}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <FiChevronLeft
          className={`w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
      </button>
    </>
  );
};

export { Sidebar };
