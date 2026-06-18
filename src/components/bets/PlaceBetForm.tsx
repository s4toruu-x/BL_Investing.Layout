import { type FC, useMemo, useState } from "react";
import { ModalWrapper } from "../shared/ModalWrapper";
import { formatCurrency } from "../../lib/format";
import type { BetOption } from "../../types/constants";

type PlaceBetFormProps = {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  options: BetOption[];
  cash: number; // available balance before this bet
  initialAmount?: number;
  initialPrediction?: string;
  isEdit?: boolean;
  onSubmit: (data: { amount: number; prediction: string }) => string | null;
};

const PCT_OPTIONS = [25, 50, 75, 100];

const PlaceBetForm: FC<PlaceBetFormProps> = ({
  isOpen,
  onClose,
  description,
  options,
  cash,
  initialAmount = 0,
  initialPrediction = "",
  isEdit = false,
  onSubmit,
}) => {
  const [amountInput, setAmountInput] = useState(String(initialAmount));
  const amount = Number(amountInput) || 0;
  const [prediction, setPrediction] = useState(initialPrediction);
  const [error, setError] = useState<string | null>(null);

  // When editing, the original stake is refunded before re-spending.
  const availableCash = useMemo(
    () => (isEdit ? cash + initialAmount - amount : cash - amount),
    [amount, cash, initialAmount, isEdit],
  );

  const setAmountFromPercent = (pct: number) => {
    setAmountInput(String(Math.floor(((availableCash + amount) * pct) / 100)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prediction) {
      setError("Please select a prediction.");
      return;
    }
    const extraCost = isEdit ? amount - initialAmount : amount;
    if (extraCost > cash) {
      setError("You cannot bet more than your available cash.");
      return;
    }
    if (amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setError(null);
    const err = onSubmit({ amount, prediction });
    if (err) setError(err);
  };

  return (
    <ModalWrapper show={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 space-y-4"
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          {isEdit ? "Edit Your Bet" : "Place Bet"}
        </h2>

        <p className="text-sm text-gray-900 dark:text-gray-100">{description}</p>

        {/* Prediction */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Your Prediction
          </label>
          <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPrediction(opt.value)}
                className={`cursor-pointer p-2 rounded text-sm transition ${
                  prediction === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Amount
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Available: {formatCurrency(availableCash)}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              min={1}
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PCT_OPTIONS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setAmountFromPercent(pct)}
                disabled={cash <= 0}
                className="h-9 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 px-1 rounded">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition cursor-pointer"
          >
            {isEdit ? "Update Bet" : "Place Bet"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export { PlaceBetForm };
