// Central demo data + lookups for the layout-only build. There is no backend;
// everything below is static placeholder data so the pages render their real
// visuals. Organized by feature: stock metadata, stocks, charts, bets.

// ─────────────────────────────────────────────────────────────────────────
// #region Stock metadata (names, tickers, icons)
// ─────────────────────────────────────────────────────────────────────────

// Maps a stock id to its display name. Mirrors the original app's `stocksMap`.
export const stocksMap: Record<string, string> = {
  apple: "Apple Inc.",
};

// Short ticker symbol per stock id.
export const tickerMap: Record<string, string> = {
  apple: "AAPL",
};

// Eagerly load every icon in the stock_icons folder, keyed by file path.
// Drop a `<id>.png` in src/assets/icons/stock_icons/ and it resolves automatically.
const stockIcons = import.meta.glob("../assets/icons/stock_icons/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const getStockIcon = (id: string): string | undefined =>
  Object.entries(stockIcons).find(([path]) => path.endsWith(`/${id}.png`))?.[1];

/** Display name for a stock id, falling back to the id itself. */
export const stockName = (id: string): string => stocksMap[id] ?? id;

/** Ticker symbol for a stock id, falling back to the upper-cased id. */
export const stockTicker = (id: string): string =>
  tickerMap[id] ?? id.toUpperCase();

// #endregion

// ─────────────────────────────────────────────────────────────────────────
// #region Stocks list + detail data
// ─────────────────────────────────────────────────────────────────────────

export type Stock = {
  id: string;
  price: number;
  change: number; // percent, last move
};

export type StockPricePoint = {
  period: number;
  label: string;
  price: number;
};

export const STOCKS: Stock[] = [{ id: "apple", price: 229.87, change: 1.24 }];

export const getStockById = (id: string): Stock | undefined =>
  STOCKS.find((s) => s.id === id);

/**
 * Deterministic price history that trends up to the stock's current price, with
 * a little wave so the line looks organic. The final point equals `latest`.
 */
export const getPriceHistory = (
  id: string,
  latest: number,
  periods = 16,
): StockPricePoint[] => {
  const seed = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const start = latest * 0.7;

  const points: StockPricePoint[] = Array.from({ length: periods }, (_, i) => {
    const t = i / (periods - 1);
    const trend = start + (latest - start) * t;
    const wave = Math.sin((i + seed) * 0.6) * latest * 0.03;
    return {
      period: i + 1,
      label: `P${i + 1}`,
      price: +(trend + wave).toFixed(2),
    };
  });

  // Anchor the last point to the real current price.
  points[points.length - 1].price = latest;
  return points;
};

// #endregion

// ─────────────────────────────────────────────────────────────────────────
// #region Charts data
// ─────────────────────────────────────────────────────────────────────────

export type ChartPricePoint = {
  stock_id: string;
  period: number;
  price: number;
};

// Display names per stock id (used for the chart legend and tooltip).
export const stockLabels: Record<string, string> = {
  apple: "Apple",
  microsoft: "Microsoft",
  alphabet: "Alphabet",
  amazon: "Amazon",
  meta: "Meta",
  tesla: "Tesla",
  nvidia: "NVIDIA",
  netflix: "Netflix",
};

// Group id -> display title.
export const groupsMap: Record<string, string> = {
  bigTech: "Big Tech",
  growth: "Growth & AI",
};

export type ChartGroup = {
  id: string;
  title: string;
  players: string[]; // stock ids
};

// Each chart plots a group of stock ids over time.
export const chartGroups: ChartGroup[] = [
  {
    id: "bigTech",
    title: "bigTech",
    players: ["apple", "microsoft", "alphabet", "amazon", "meta"],
  },
  { id: "growth", title: "growth", players: ["tesla", "nvidia", "netflix"] },
];

const CHART_PERIODS = 16;

// Deterministic pseudo-random walk so the lines look organic but stable.
const chartBasePrices: Record<string, number> = {
  apple: 150,
  microsoft: 300,
  alphabet: 120,
  amazon: 130,
  meta: 350,
  tesla: 200,
  nvidia: 70,
  netflix: 480,
};

const buildChartHistory = (): ChartPricePoint[] => {
  const points: ChartPricePoint[] = [];

  Object.entries(chartBasePrices).forEach(([stock_id, base], idx) => {
    for (let period = 1; period <= CHART_PERIODS; period++) {
      const wave = Math.sin((period + idx) * 0.7) * (base * 0.04);
      const drift = (period - 1) * (base * 0.012);
      points.push({
        stock_id,
        period,
        price: +(base + drift + wave).toFixed(2),
      });
    }
  });

  return points;
};

export const priceHistory: ChartPricePoint[] = buildChartHistory();

// #endregion

// ─────────────────────────────────────────────────────────────────────────
// #region Bets data
// ─────────────────────────────────────────────────────────────────────────

export type BetOption = { value: string; label: string };

export type Bet = {
  id: string;
  description: string;
  status: "active" | "paid";
  outcome: string | null; // resolved winning option, or null while open
  betting_deadline: string; // ISO — betting closes
  expire_time: string; // ISO — event finishes
  options: BetOption[];
  totalBettors: number;
  optionCounts: Record<string, number>; // votes from other players, per option
};

/** The viewer's own placed bet on a given bet. */
export type UserBet = { prediction: string; amount: number };

/** Starting virtual balance for the demo (no real account/backend). */
export const DEMO_CASH = 1000;

const days = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

const yesNo: BetOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const BETS: Bet[] = [
  {
    id: "sp500-week",
    description: "Will the S&P 500 close higher this week?",
    status: "active",
    outcome: null,
    betting_deadline: days(3),
    expire_time: days(4),
    options: yesNo,
    totalBettors: 312,
    optionCounts: { yes: 196, no: 116 },
  },
  {
    id: "sector-quarter",
    description: "Which sector leads next quarter?",
    status: "active",
    outcome: null,
    betting_deadline: days(6),
    expire_time: days(90),
    options: [
      { value: "tech", label: "Technology" },
      { value: "energy", label: "Energy" },
      { value: "health", label: "Healthcare" },
    ],
    totalBettors: 248,
    optionCounts: { tech: 150, energy: 58, health: 40 },
  },
  {
    id: "btc-100k",
    description: "Will Bitcoin break $100k by Friday?",
    status: "active",
    outcome: null,
    betting_deadline: days(1),
    expire_time: days(2),
    options: yesNo,
    totalBettors: 521,
    optionCounts: { yes: 270, no: 251 },
  },
  {
    id: "fed-cut",
    description: "Did the Fed cut rates at the last meeting?",
    status: "paid",
    outcome: "yes",
    betting_deadline: days(-5),
    expire_time: days(-4),
    options: yesNo,
    totalBettors: 430,
    optionCounts: { yes: 301, no: 129 },
  },
];

export const getBetLabel = (bet: Bet, value: string): string =>
  bet.options.find((o) => o.value === value)?.label ?? value;

/** Share of votes per option (0–100, rounded), derived from optionCounts. */
export const optionPercentages = (bet: Bet): Record<string, number> => {
  const total = Object.values(bet.optionCounts).reduce((a, b) => a + b, 0);
  return Object.fromEntries(
    bet.options.map((o) => [
      o.value,
      total > 0
        ? Math.round(((bet.optionCounts[o.value] ?? 0) / total) * 100)
        : 0,
    ]),
  );
};

// #endregion
