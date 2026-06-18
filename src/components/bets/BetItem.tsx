import { useState, type FC } from "react";
import { useCountdown } from "../../hooks/useCountdown";
import { formatCurrency } from "../../lib/format";
import { StatusBadge } from "./StatusBadge";
import { BetStatsModal } from "./BetStatsModal";
import { getBetLabel, type Bet, type UserBet } from "../../types/constants";

const BetItem: FC<{
  bet: Bet;
  userBet?: UserBet;
  onPlace: () => void;
  onEdit: () => void;
  onRemove: () => void;
}> = ({ bet, userBet, onPlace, onEdit, onRemove }) => {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const countdown = useCountdown(bet.betting_deadline);

  const hasUserBet = !!userBet;
  const isResolved = bet.outcome !== null;
  const isExpired = new Date(bet.betting_deadline) < new Date();
  const hasFinished = new Date(bet.expire_time) < new Date();
  const didMissBet = hasFinished && !hasUserBet;

  const isWon = hasUserBet && isResolved && userBet!.prediction === bet.outcome;
  const canAct = !isResolved && !isExpired && !hasFinished;

  const containerClass = isResolved
    ? isWon
      ? "p-4 rounded-xl border border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-900/20"
      : hasUserBet
        ? "p-4 rounded-xl border border-red-200 dark:border-red-700/50 bg-red-50 dark:bg-red-900/20"
        : "p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-75"
    : didMissBet
      ? "p-4 rounded-xl border border-yellow-200 dark:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-900/20 opacity-80"
      : "p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors";

  return (
    <>
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-2 gap-3">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          {bet.description}
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {bet.outcome === null
            ? countdown
            : `Resolved: ${getBetLabel(bet, bet.outcome)}`}
        </span>
      </div>

      <div className="mb-3">
        <StatusBadge
          status={bet.status}
          isResolved={isResolved}
          isWon={isWon}
          hasUserBet={hasUserBet}
          isExpired={isExpired}
        />
      </div>

      <div
        onClick={() => {
          if (bet.totalBettors > 0) setIsStatsOpen(true);
        }}
        className="text-sm text-gray-500 dark:text-gray-400 mb-3 cursor-pointer hover:underline hover:text-gray-700 dark:hover:text-gray-300 transition"
        title="Click to view detailed stats"
      >
        {bet.totalBettors} people betted
      </div>

      {!hasUserBet ? (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400 dark:text-gray-500">
            {didMissBet
              ? "This bet has finished and you did not place a bet"
              : isExpired
                ? "Betting deadline has passed"
                : "You haven't placed a bet"}
          </div>
          {canAct && (
            <button
              onClick={onPlace}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition cursor-pointer"
            >
              Place Bet
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300 mb-3">
            <p>
              Your prediction:{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {getBetLabel(bet, userBet!.prediction)}
              </span>
            </p>
            <p>
              Amount:{" "}
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(userBet!.amount)}
              </span>
            </p>
            {isResolved ? (
              <p>
                {isWon ? "Payout received: " : "Lost: "}
                <span
                  className={`font-semibold ${
                    isWon
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isWon
                    ? `+${formatCurrency(userBet!.amount * 2)}`
                    : `-${formatCurrency(userBet!.amount)}`}
                </span>
              </p>
            ) : (
              <p>
                Potential payout:{" "}
                <span className="text-gray-900 dark:text-gray-100">
                  {formatCurrency(userBet!.amount * 2)}
                </span>
              </p>
            )}
          </div>

          {canAct && (
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition cursor-pointer"
              >
                Edit Bet
              </button>
              <button
                onClick={onRemove}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition cursor-pointer"
              >
                Remove Bet
              </button>
            </div>
          )}
        </>
      )}
    </div>

    <BetStatsModal
      isOpen={isStatsOpen}
      onClose={() => setIsStatsOpen(false)}
      bet={bet}
    />
    </>
  );
};

export { BetItem };
