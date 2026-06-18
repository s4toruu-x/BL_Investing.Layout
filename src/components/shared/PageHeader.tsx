import type { FC, ReactNode } from "react";
import { FaRegCircleQuestion } from "react-icons/fa6";

/**
 * Standard page header shared across pages: a bold title, optional subtitle, an
 * optional "?" help trigger next to the title, and an optional right-aligned
 * action slot.
 */
const PageHeader: FC<{
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onHelp?: () => void;
  action?: ReactNode;
}> = ({ title, subtitle, icon, onHelp, action }) => (
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <div className="flex items-center gap-2">
        {icon}
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
        {onHelp && (
          <button
            onClick={onHelp}
            aria-label={`How ${title} works`}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            <FaRegCircleQuestion className="text-lg" />
          </button>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
);

export { PageHeader };
