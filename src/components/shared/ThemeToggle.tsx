import { FiSun, FiMoon } from "react-icons/fi";
import { useDarkMode } from "../../hooks/useDarkMode";

export const ThemeToggle = ({
  collapsed = false,
  iconOnly = false,
}: {
  collapsed?: boolean;
  iconOnly?: boolean;
}) => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const label = isDark ? "Light Mode" : "Dark Mode";
  const Icon = isDark ? FiSun : FiMoon;
  const compact = iconOnly || collapsed;

  return (
    <button
      onClick={toggleDarkMode}
      title={compact ? (isDark ? "Light mode" : "Dark mode") : undefined}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group flex items-center gap-3 px-2.5 rounded-lg text-sm font-medium cursor-pointer h-[42px]
        bg-gray-100 dark:bg-gray-800
        text-gray-500 dark:text-gray-400
        hover:bg-gray-200 dark:hover:bg-gray-700
        hover:text-gray-900 dark:hover:text-white
        transition-colors duration-150
        ${iconOnly ? "w-[42px] flex-shrink-0 justify-center px-0" : "w-full"}
        ${collapsed ? "md:w-9 md:h-9 md:p-0 md:justify-center md:mx-auto" : ""}`}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 ${
          isDark ? "text-amber-400" : "text-indigo-500"
        }`}
      />
      <span className={compact ? (collapsed ? "md:hidden" : "hidden") : ""}>
        {label}
      </span>
    </button>
  );
};
