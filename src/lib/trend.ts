// A price move is up, down, or flat. Centralizes the colors/glyphs each one
// maps to so components don't repeat sign-based ternaries.

export type Trend = "up" | "down" | "flat";

export const trendOf = (change: number): Trend =>
  change > 0 ? "up" : change < 0 ? "down" : "flat";

type TrendStyle = {
  text: string;
  border: string;
  divider: string;
  arrow: string;
};

export const TREND_STYLES: Record<Trend, TrendStyle> = {
  up: {
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/30",
    divider: "bg-emerald-500/30",
    arrow: "▲",
  },
  down: {
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    divider: "bg-red-500/30",
    arrow: "▼",
  },
  flat: {
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-700/50",
    divider: "bg-gray-700/50",
    arrow: "—",
  },
};
