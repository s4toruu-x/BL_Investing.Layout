import { useMemo, useState, type FC } from "react";
import { FiSearch } from "react-icons/fi";
import { PageWrapper } from "../shared/PageWrapper";
import { PageHeader } from "../shared/PageHeader";
import { formatCurrency } from "../../lib/format";
import { BetItem } from "./BetItem";
import { PlaceBetForm } from "./PlaceBetForm";
import {
  BETS,
  DEMO_CASH,
  type Bet,
  type UserBet,
} from "../../types/constants";

type FilterValue = "all" | "active" | "paid";

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Paid", value: "paid" },
];

const BetsPage: FC = () => {
  // No backend/auth: the viewer's bets and balance live in local state.
  const [cash, setCash] = useState(DEMO_CASH);
  const [userBets, setUserBets] = useState<Record<string, UserBet>>({});

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("active");
  const [activeBet, setActiveBet] = useState<Bet | null>(null);

  const filteredBets = useMemo(
    () =>
      BETS.filter((bet) => {
        const matchesSearch = bet.description
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesFilter = filter === "all" || bet.status === filter;
        return matchesSearch && matchesFilter;
      }),
    [search, filter],
  );

  const handleSubmit = (data: { amount: number; prediction: string }) => {
    if (!activeBet) return "No bet selected";

    const previous = userBets[activeBet.id]?.amount ?? 0;
    const extraCost = data.amount - previous;
    if (extraCost > cash) return "You cannot bet more than your available cash.";

    setCash((c) => c - extraCost);
    setUserBets((prev) => ({
      ...prev,
      [activeBet.id]: { prediction: data.prediction, amount: data.amount },
    }));
    setActiveBet(null);
    return null;
  };

  const removeBet = (betId: string) => {
    const placed = userBets[betId];
    if (!placed) return;
    setCash((c) => c + placed.amount);
    setUserBets((prev) => {
      const next = { ...prev };
      delete next[betId];
      return next;
    });
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Bets"
        subtitle="Place and track your bets."
        action={
          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            Balance: {formatCurrency(cash)}
          </span>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-800">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition ${
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredBets.length === 0 ? (
          <div className="py-10 text-center text-lg text-gray-600 dark:text-gray-400">
            No matching bets.
          </div>
        ) : (
          filteredBets.map((bet) => (
            <BetItem
              key={bet.id}
              bet={bet}
              userBet={userBets[bet.id]}
              onPlace={() => setActiveBet(bet)}
              onEdit={() => setActiveBet(bet)}
              onRemove={() => removeBet(bet.id)}
            />
          ))
        )}
      </div>

      {activeBet && (
        <PlaceBetForm
          isOpen={!!activeBet}
          onClose={() => setActiveBet(null)}
          description={activeBet.description}
          options={activeBet.options}
          cash={cash}
          isEdit={!!userBets[activeBet.id]}
          initialAmount={userBets[activeBet.id]?.amount}
          initialPrediction={userBets[activeBet.id]?.prediction}
          onSubmit={handleSubmit}
        />
      )}
    </PageWrapper>
  );
};

export { BetsPage };
