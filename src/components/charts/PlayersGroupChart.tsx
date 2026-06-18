/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { chartSurfaceClass } from "../../lib/chart";
import {
  groupsMap,
  stockLabels,
  type ChartPricePoint,
} from "../../types/constants";
import { formatCurrency } from "../../lib/format";

type PlayersGroupChartProps = {
  title: string;
  stocks: ChartPricePoint[];
  players: string[];
  playerColors: Record<string, string>;
};

type PeriodData = {
  period: number;
  [stockId: string]: number;
};

const PlayersGroupChart: FC<PlayersGroupChartProps> = ({
  title,
  stocks,
  players,
  playerColors,
}) => {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);

  const playerRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const lastValidWidth = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const initial = containerRef.current.getBoundingClientRect().width;
    if (initial > 0) {
      lastValidWidth.current = initial;
      setWidth(initial);
    }

    let timer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (w > 0) {
          lastValidWidth.current = w;
          setWidth(w);
        }
      }, 100);
    });

    ro.observe(containerRef.current);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const chartWidth = lastValidWidth.current || width;
  const isMobile = chartWidth > 0 && chartWidth < 768;

  const data = useMemo(() => {
    const playerSet = new Set(players);
    const grouped: Record<number, PeriodData> = {};

    for (const s of stocks) {
      if (!playerSet.has(s.stock_id)) continue;

      if (!grouped[s.period]) {
        grouped[s.period] = { period: s.period };
      }

      grouped[s.period][s.stock_id] = s.price;
    }

    return Object.values(grouped).sort((a, b) => a.period - b.period);
  }, [stocks, players]);

  const colorToPlayer = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of players) {
      map[playerColors[p]] = p;
    }
    return map;
  }, [players, playerColors]);

  const toggleHidden = useCallback((dataKey: string) => {
    setHidden((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  }, []);

  const customMouseOver = useCallback(
    (e: any) => {
      playerRef.current = colorToPlayer[e?.fill] ?? null;
    },
    [colorToPlayer],
  );

  const handleMouseLeave = useCallback(() => {
    playerRef.current = null;
  }, []);

  const tooltipFormatter = useCallback((value: any, name: any) => {
    if (playerRef.current === stockLabels[name] || playerRef.current === name) {
      return [formatCurrency(Number(value)), stockLabels[name] ?? name];
    }
    return null;
  }, []);

  const renderLegend = useCallback(
    (props: any) => {
      const { payload } = props;

      const items = payload.map((entry: any) => {
        const { dataKey, color } = entry;
        const isHidden = hidden[dataKey];

        return (
          <li
            key={dataKey}
            onClick={() => toggleHidden(dataKey)}
            className={`flex items-center gap-2 cursor-pointer select-none transition-opacity
                ${isHidden ? "opacity-40" : ""}
                ${
                  isMobile
                    ? "px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/40"
                    : ""
                }
              `}
          >
            <span
              className={
                isMobile ? "w-2.5 h-2.5 rounded-full" : "h-1 w-4 rounded"
              }
              style={{
                backgroundColor: isHidden ? "#64748b" : color,
              }}
            />

            <span
              className={`text-xs font-medium ${
                isHidden
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {stockLabels[dataKey] ?? dataKey}
            </span>
          </li>
        );
      });

      if (isMobile) {
        return (
          <div className="w-full">
            <button
              type="button"
              onClick={() => setIsLegendExpanded((v) => !v)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              <span>Legend ({payload.length} items)</span>
              <span
                className={`transition-transform ${
                  isLegendExpanded ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isLegendExpanded && (
              <ul className="flex flex-wrap justify-center gap-3 px-2 py-2">
                {items}
              </ul>
            )}
          </div>
        );
      }

      return <ul className="flex flex-wrap justify-center gap-4">{items}</ul>;
    },
    [hidden, isMobile, isLegendExpanded, toggleHidden],
  );

  const chartHeight = 420;
  const minWidth = isMobile ? Math.max(700, data.length * 56) : undefined;

  return (
    <div className="mb-8 w-full rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 dark:border-gray-700">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Stock Group
          </p>

          <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
            {groupsMap[title] ?? title}
          </h2>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`${chartSurfaceClass} ${
          isMobile ? "overflow-x-auto overflow-y-hidden" : ""
        }`}
      >
        <div
          style={{
            height: chartHeight,
            width: isMobile ? minWidth : "100%",
          }}
        >
          {chartWidth ? (
            <LineChart
              width={chartWidth}
              height={chartHeight}
              data={data}
              margin={{ top: 20, right: 24, left: 8, bottom: 12 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="currentColor"
                className="text-slate-600/35"
                vertical={false}
              />

              <XAxis
                dataKey="period"
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
                width={56}
                tick={{ fill: "#8ea1c0", fontSize: 12 }}
                tickFormatter={(v) =>
                  formatCurrency(Number(v), { maximumFractionDigits: 0 })
                }
              />

              <Tooltip
                formatter={tooltipFormatter as any}
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "0.75rem",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                  color: "#f8fafc",
                }}
                labelStyle={{ color: "#94a3b8" }}
                cursor={{
                  stroke: "#38bdf8",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                  opacity: 0.5,
                }}
              />

              <Legend content={renderLegend} />

              {players.map((player) => (
                <Line
                  key={player}
                  type="monotone"
                  dataKey={player}
                  strokeWidth={3}
                  dot={false}
                  hide={!!hidden[player]}
                  stroke={playerColors[player]}
                  style={{
                    filter: `drop-shadow(0 0 5px ${playerColors[player]}55)`,
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "#ffffff",
                    strokeWidth: 2,
                    fill: playerColors[player],
                    onMouseOver: customMouseOver,
                    onMouseLeave: handleMouseLeave,
                  }}
                />
              ))}
            </LineChart>
          ) : (
            <div style={{ height: chartHeight }} />
          )}
        </div>

        {isMobile && (
          <div className="flex justify-center gap-1 py-3">
            <div className="h-1 w-5 rounded-full bg-slate-500/60" />
            <div className="h-1 w-2 rounded-full bg-slate-600/60" />
            <div className="h-1 w-2 rounded-full bg-slate-600/60" />
          </div>
        )}
      </div>
    </div>
  );
};

export { PlayersGroupChart };
