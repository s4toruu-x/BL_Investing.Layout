import { useState, type FC } from "react";
import NumberFlow from "@number-flow/react";
import { formatCurrency } from "../../lib/format";

type Props = {
  name: string;
  price: number;
  cash: number;
  owned: number;
  onTrade: (type: "BUY" | "SELL", qty: number) => string | null;
};

const DELTAS = [-50, -25, -10, 10, 25, 50];

const TradeControls: FC<Props> = ({ name, price, cash, owned, onTrade }) => {
  const [mode, setMode] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const maxBuyable = price > 0 ? Math.floor(cash / price) : 0;
  const cap = mode === "BUY" ? maxBuyable : owned;

  const tradeValue = qty * price;
  const afterCash = mode === "BUY" ? cash - tradeValue : cash + tradeValue;

  const setClamped = (n: number) => setQty(Math.max(0, Math.min(cap, n)));

  const submit = () => {
    const err = onTrade(mode, qty);
    if (err) {
      setError(err);
      setSuccess(null);
    } else {
      setSuccess(
        `${mode === "BUY" ? "Bought" : "Sold"} ${qty} share${qty !== 1 ? "s" : ""}.`,
      );
      setError(null);
      setQty(1);
    }
  };

  const disabled =
    qty <= 0 ||
    (mode === "BUY" && tradeValue > cash) ||
    (mode === "SELL" && qty > owned);

  return (
    <section className="w-full space-y-3 pt-6">
      {/* Buy / Sell toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-1 dark:bg-gray-700/50">
        {(["BUY", "SELL"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setQty(1);
            }}
            className={`h-8 cursor-pointer rounded-lg text-xs font-bold transition ${
              mode === m
                ? m === "BUY"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-red-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {m === "BUY" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      {/* Quantity stepper */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Trade Quantity
        </p>
        <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50">
          <button
            onClick={() => setClamped(qty - 1)}
            disabled={qty <= 0}
            className="h-9 w-10 cursor-pointer text-base font-bold text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            –
          </button>
          <input
            type="number"
            value={qty}
            inputMode="numeric"
            onChange={(e) =>
              setClamped(/^\d+$/.test(e.target.value) ? Number(e.target.value) : 0)
            }
            className="h-9 min-w-0 flex-1 bg-transparent text-center text-sm font-bold text-gray-900 outline-none dark:text-white"
          />
          <button
            onClick={() => setClamped(qty + 1)}
            className="h-9 w-10 cursor-pointer text-base font-bold text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            +
          </button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))]">
          <button
            onClick={() => setClamped(cap)}
            disabled={cap <= 0}
            className={`h-8 cursor-pointer rounded-xl border px-3 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
              mode === "BUY"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700/60 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-700/60 dark:bg-red-500/10 dark:text-red-300"
            }`}
          >
            {mode === "BUY" ? "Max" : "Owned"}
          </button>

          {DELTAS.map((delta) => (
            <button
              key={delta}
              onClick={() => setClamped(qty + delta)}
              className="h-8 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              {delta > 0 ? `+${delta}` : delta}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              {mode === "BUY" ? "Buy Cost" : "Sell Value"}
            </p>
            <p
              className={`mt-1 text-sm font-bold ${
                mode === "BUY"
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              <NumberFlow
                value={Number(tradeValue.toFixed(2))}
                prefix={mode === "BUY" ? "- $" : "+ $"}
              />
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              After Trade
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <NumberFlow value={Number(afterCash.toFixed(2))} prefix="$" />
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-xs dark:border-gray-700">
          <span className="text-gray-400 dark:text-gray-500">
            Available balance
          </span>
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(cash)}
          </span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {success}
        </p>
      )}

      <button
        onClick={submit}
        disabled={disabled}
        className={`h-10 w-full cursor-pointer rounded-xl text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
          mode === "BUY"
            ? "bg-emerald-600 hover:bg-emerald-500"
            : "bg-red-600 hover:bg-red-500"
        }`}
      >
        {mode === "BUY" ? "Buy" : "Sell"} {qty > 0 ? qty : ""}{" "}
        {name} share{qty !== 1 ? "s" : ""}
      </button>
    </section>
  );
};

export { TradeControls };
