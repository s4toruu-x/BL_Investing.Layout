import type { FC } from "react";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";

const StatusBadge: FC<{
  status: string;
  isResolved: boolean;
  isWon: boolean;
  hasUserBet: boolean;
  isExpired: boolean;
}> = ({ status, isResolved, isWon, hasUserBet, isExpired }) => {
  if (isResolved) {
    if (!hasUserBet)
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <FiCheckCircle size={12} />
          Resolved
        </span>
      );
    return isWon ? (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
        <FiCheckCircle size={12} />
        Won
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
        <FiXCircle size={12} />
        Lost
      </span>
    );
  }

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400">
        <FiAlertCircle size={12} />
        Awaiting result
      </span>
    );
  }

  if (status === "active")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Active
      </span>
    );

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
      <FiAlertCircle size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export { StatusBadge };
