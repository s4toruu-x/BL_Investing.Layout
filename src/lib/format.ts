// Shared number/value formatting helpers.

export const formatCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {},
): string =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  });

/** Signed percentage with two decimals, e.g. "+1.24%" / "-0.58%". */
export const formatPercent = (value: number): string =>
  `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
