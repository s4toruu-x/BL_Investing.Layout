import type { FC } from "react";
import { ModalWrapper } from "../shared/ModalWrapper";
import { optionPercentages, type Bet } from "../../types/constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  bet: Bet;
};

const BetStatsModal: FC<Props> = ({ isOpen, onClose, bet }) => {
  const percentages = optionPercentages(bet);
  const sorted = [...bet.options].sort(
    (a, b) => (bet.optionCounts[b.value] ?? 0) - (bet.optionCounts[a.value] ?? 0),
  );

  return (
    <ModalWrapper show={isOpen} onClose={onClose}>
      <div className="overflow-hidden rounded-2xl bg-white p-6 dark:bg-gray-900">
        <div className="flex items-start justify-between gap-4 pb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Bet Statistics
          </h2>
          <button
            onClick={onClose}
            className="mt-0.5 cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          {bet.description}
        </p>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Option
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Bets
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                %
              </th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((opt, i) => (
              <tr
                key={opt.value}
                className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                style={{ opacity: Math.max(0.4, 1 - i * 0.15) }}
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {opt.label}
                  {bet.outcome === opt.value && (
                    <span className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      winner
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-right text-gray-500 dark:text-gray-400">
                  {bet.optionCounts[opt.value] ?? 0}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                  {percentages[opt.value] ?? 0}%
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <td className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Total
              </td>
              <td className="px-3 py-2.5 text-right text-xs font-medium text-gray-900 dark:text-gray-100">
                {bet.totalBettors}
              </td>
              <td className="px-4 py-2.5 text-right text-xs font-medium text-gray-900 dark:text-gray-100">
                100%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </ModalWrapper>
  );
};

export { BetStatsModal };
