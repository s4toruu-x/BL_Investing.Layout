import { useMemo, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import NumberFlow from "@number-flow/react";
import { FiUsers } from "react-icons/fi";
import {
  getStockIcon,
  stockName,
  getPriceHistory,
  getStockById,
} from "../../types/constants";
import { formatCurrency } from "../../lib/format";
import { TREND_STYLES, trendOf } from "../../lib/trend";
import { PageWrapper } from "../shared/PageWrapper";
import { PageHeader } from "../shared/PageHeader";
import { GoBackButton } from "../shared/GoBackButton";
import { PriceChart } from "./PriceChart";
import { TradeControls } from "./TradeControls";

const DEMO_CASH = 1000;
const DEMO_OWNERS = 142;

const rangeSelectClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100";

const StockInformation: FC = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const stock = stockId ? getStockById(stockId) : undefined;

  const [cash, setCash] = useState(DEMO_CASH);
  const [owned, setOwned] = useState(0);

  const priceHistory = useMemo(
    () => (stock ? getPriceHistory(stock.id, stock.price) : []),
    [stock],
  );

  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(priceHistory.length - 1);

  const range = useMemo(() => {
    const lo = Math.min(startIdx, endIdx);
    const hi = Math.max(startIdx, endIdx);
    return priceHistory.slice(lo, hi + 1);
  }, [priceHistory, startIdx, endIdx]);

  if (!stock) {
    return (
      <PageWrapper>
        <GoBackButton />
        <p className="py-10 text-center text-lg text-gray-600 dark:text-gray-400">
          Stock "{stockId}" not found.
        </p>
      </PageWrapper>
    );
  }

  const latest = priceHistory.at(-1)?.price ?? 0;
  const rangeFirst = range.at(0)?.price ?? 0;
  const rangeLast = range.at(-1)?.price ?? 0;
  const rangeChange = rangeFirst
    ? +(((rangeLast - rangeFirst) / rangeFirst) * 100).toFixed(2)
    : 0;
  const trend = TREND_STYLES[trendOf(rangeChange)];

  const handleTrade = (type: "BUY" | "SELL", qty: number): string | null => {
    const total = qty * latest;
    if (type === "BUY") {
      if (total > cash) return "Insufficient funds.";
      setCash((c) => c - total);
      setOwned((o) => o + qty);
    } else {
      if (qty > owned) return "Not enough shares to sell.";
      setCash((c) => c + total);
      setOwned((o) => o - qty);
    }
    return null;
  };

  return (
    <PageWrapper>
      <PageHeader
        title={stockName(stock.id)}
        subtitle="Trade and track this stock."
        icon={
          getStockIcon(stock.id) ? (
            <img
              src={getStockIcon(stock.id)}
              alt={stock.id}
              className="h-9 w-9 flex-shrink-0 rounded-full border border-gray-200 dark:border-gray-600"
            />
          ) : undefined
        }
      />

      <div className="relative rounded-xl bg-white p-6 shadow-lg transition-colors duration-300 dark:bg-gray-800 dark:shadow-gray-900/50">
        <GoBackButton />

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Market Overview
              </p>
              <div className="mt-1.5 flex items-baseline gap-2.5">
                <span className="text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
                  {formatCurrency(latest)}
                </span>
                <span className={`flex items-center gap-1 text-sm tabular-nums ${trend.text}`}>
                  <span>{trend.arrow}</span>
                  <span>
                    {rangeChange > 0 ? "+" : ""}
                    {rangeChange.toFixed(2)}%
                  </span>
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <FiUsers className="h-3 w-3" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {DEMO_OWNERS}
                </span>
                investors
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:min-w-72">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  From
                </p>
                <select
                  value={startIdx}
                  onChange={(e) => setStartIdx(Number(e.target.value))}
                  className={rangeSelectClass}
                >
                  {priceHistory.map((p, i) => (
                    <option key={p.period} value={i}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  To
                </p>
                <select
                  value={endIdx}
                  onChange={(e) => setEndIdx(Number(e.target.value))}
                  className={rangeSelectClass}
                >
                  {priceHistory.map((p, i) => (
                    <option key={p.period} value={i}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <PriceChart priceHistory={range} />

          <div className="grid grid-cols-1 border-t border-gray-100 dark:border-gray-700 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700 sm:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                You Own
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                <NumberFlow
                  value={owned}
                  suffix={` share${owned !== 1 ? "s" : ""}`}
                />
              </p>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700 sm:border-l sm:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Position Value
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                <NumberFlow value={Number((owned * latest).toFixed(2))} prefix="$" />
              </p>
            </div>
          </div>
        </section>

        <TradeControls
          name={stockName(stock.id)}
          price={latest}
          cash={cash}
          owned={owned}
          onTrade={handleTrade}
        />
      </div>
    </PageWrapper>
  );
};

export { StockInformation };
