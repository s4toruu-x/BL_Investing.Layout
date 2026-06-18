/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { chartSurfaceClass } from "../../lib/chart";
import { formatCurrency } from "../../lib/format";
import type { StockPricePoint } from "../../types/constants";

const PriceTooltip: FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[140px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-1 text-gray-500 dark:text-gray-400">{label}</div>
      <div className="font-semibold text-gray-900 dark:text-gray-100">
        {formatCurrency(Number(payload[0].value))}
      </div>
    </div>
  );
};

const PriceChart: FC<{ priceHistory: StockPricePoint[] }> = ({
  priceHistory,
}) => {
  const firstPrice = priceHistory.at(0)?.price ?? 0;
  const lastPrice = priceHistory.at(-1)?.price ?? 0;

  const chartColor =
    lastPrice > firstPrice
      ? "#10b981"
      : lastPrice < firstPrice
        ? "#ef4444"
        : "#64748b";

  return (
    <div className={`h-64 w-full overflow-hidden ${chartSurfaceClass} sm:h-80`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={priceHistory}
          margin={{ top: 20, right: 24, left: 8, bottom: 12 }}
        >
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.32} />
              <stop offset="55%" stopColor={chartColor} stopOpacity={0.1} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="2 4"
            stroke="currentColor"
            className="text-slate-600/30"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: "#8ea1c0", fontSize: 12 }}
          />

          <YAxis
            domain={["auto", "auto"]}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            width={72}
            tick={{ fill: "#8ea1c0", fontSize: 12 }}
            tickFormatter={(value) =>
              formatCurrency(Number(value), {
                notation: "compact",
                maximumFractionDigits: 1,
              })
            }
          />

          <Tooltip
            content={<PriceTooltip />}
            cursor={{
              stroke: chartColor,
              strokeWidth: 1,
              strokeDasharray: "4 4",
              opacity: 0.6,
            }}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke={chartColor}
            strokeWidth={3}
            fill="url(#priceFill)"
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#ffffff",
              strokeWidth: 2,
              fill: chartColor,
            }}
            style={{ filter: `drop-shadow(0 0 6px ${chartColor}55)` }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export { PriceChart };
