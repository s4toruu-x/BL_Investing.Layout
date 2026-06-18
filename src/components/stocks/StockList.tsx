import { useMemo, useState, type FC } from "react";
import { FiSearch } from "react-icons/fi";
import { PageWrapper } from "../shared/PageWrapper";
import { PageHeader } from "../shared/PageHeader";
import { stockName, stockTicker, STOCKS } from "../../types/constants";
import { StockItem } from "./StockItem";

const StockList: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return STOCKS;
    return STOCKS.filter(
      (s) =>
        stockName(s.id).toLowerCase().includes(term) ||
        stockTicker(s.id).toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <PageWrapper>
      <PageHeader
        title="Stocks"
        subtitle="Browse the market and track price movements."
      />

      <div className="relative max-w-sm">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or ticker"
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-10 text-center text-lg text-gray-600 transition-colors duration-300 dark:text-gray-400">
          No matching stocks. Try a different term.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4">
          {filtered.map((stock) => (
            <StockItem key={stock.id} stock={stock} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export { StockList };
