import { type FC } from "react";
import { Link } from "react-router-dom";
import { FiDollarSign, FiTrendingUp } from "react-icons/fi";
import {
  getStockIcon,
  stockName,
  stockTicker,
  type Stock,
} from "../../types/constants";
import { formatCurrency, formatPercent } from "../../lib/format";
import { TREND_STYLES, trendOf } from "../../lib/trend";

const PALETTE = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

// Deterministic monogram background for ids without an icon yet.
const monogramColor = (id: string): string => {
  const sum = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
};

const StatCell: FC<{
  label: string;
  icon: FC<{ className?: string }>;
  children: React.ReactNode;
}> = ({ label, icon: Icon, children }) => (
  <div className="flex flex-1 flex-col items-center gap-0.5 px-3 py-2">
    <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
      <Icon className="h-3 w-3" />
      {label}
    </span>
    {children}
  </div>
);

const StockItem: FC<{ stock: Stock }> = ({ stock }) => {
  const name = stockName(stock.id);
  const ticker = stockTicker(stock.id);
  const icon = getStockIcon(stock.id);
  const trend = TREND_STYLES[trendOf(stock.change)];

  return (
    <Link
      to={`/stocks/${stock.id}`}
      className="relative flex flex-col rounded-2xl border border-gray-200 bg-white
        overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1
        hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-gray-900/60"
    >
      <div className="flex flex-col items-center gap-1.5 px-3 pt-4 pb-3">
        {icon ? (
          <img
            src={icon}
            alt={name}
            width={60}
            height={60}
            className="h-[60px] w-[60px] rounded-full border-2 border-gray-300 object-contain dark:border-gray-600"
          />
        ) : (
          <div
            className={`flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-gray-300 text-lg font-bold text-white dark:border-gray-600 ${monogramColor(
              stock.id,
            )}`}
          >
            {ticker.slice(0, 2)}
          </div>
        )}

        <p className="line-clamp-1 w-full max-w-full text-center text-sm font-semibold leading-tight text-gray-800 dark:text-gray-100">
          {name}
        </p>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-500 dark:bg-gray-700 dark:text-gray-300">
          {ticker}
        </span>
      </div>

      <div className={`flex border-t ${trend.border}`}>
        <StatCell label="Price" icon={FiDollarSign}>
          <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">
            {formatCurrency(stock.price)}
          </span>
        </StatCell>

        <div className={`w-px ${trend.divider}`} />

        <StatCell label="Change" icon={FiTrendingUp}>
          <span
            className={`inline-flex items-center gap-0.5 text-sm font-bold tabular-nums ${trend.text}`}
          >
            <span className="text-[10px]">{trend.arrow}</span>
            {formatPercent(stock.change)}
          </span>
        </StatCell>
      </div>
    </Link>
  );
};

export { StockItem };
