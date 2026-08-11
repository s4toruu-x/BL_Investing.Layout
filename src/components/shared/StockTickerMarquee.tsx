import Marquee from "react-fast-marquee";
import { memo, type FC } from "react";
import { STOCKS, stockTicker } from "../../types/constants";

const StockTickerComponent: FC = () => {
  if (!STOCKS.length) return null;

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700/50 py-1.5 overflow-hidden">
      <Marquee direction="left" speed={40} gradient={false}>
        {STOCKS.filter((stock) => stock.change !== 0).map((stock) => {
          const change = stock.change;
          const isUp = change > 0;
          const isDown = change < 0;
          const changeColor = isUp
            ? "text-emerald-500 dark:text-emerald-400"
            : isDown
              ? "text-red-500 dark:text-red-400"
              : "text-gray-400 dark:text-gray-400";
          return (
            <span
              key={stock.id}
              className="inline-flex items-center gap-1.5 mx-6 text-sm font-semibold tabular-nums"
            >
              <span className="text-gray-500 dark:text-gray-400">
                ${stockTicker(stock.id)}
              </span>
              <span className="text-gray-900 dark:text-white">
                {stock.price.toFixed(2)}
              </span>
              <span className={changeColor}>
                {isUp ? "▲" : isDown ? "▼" : "—"}
                {isUp ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </span>
          );
        })}
      </Marquee>
    </div>
  );
};

const StockTicker = memo(StockTickerComponent);

export { StockTicker };
