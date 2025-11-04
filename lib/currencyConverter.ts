import { currency, getCurrencySymbol } from "@/app/_docs/doc";
import { useAppContext } from "@/context/appContext";

export type CurrencyCode = keyof typeof currency;

export interface CurrencyRates {
  [key: string]: number;
}

export interface ConvertedResult {
  amount: number;
  symbol: string;
  formatted: string;
}

/**
 * Converts an amount from one currency to another.
 * Automatically detects conversion direction even if base rate differs.
 * Accepts number, string, or decimal input for amount.
 *
 * @param source - Source currency code (e.g., "USD")
 * @param target - Target currency code (e.g., "NGN")
 * @param amount - Amount to convert (number, string, or decimal)
 * @param rates - Currency rates from context
 * @param showSymbol - If true, prepends the currency symbol (₦, $, £)
 * @param useLocale - If true, formats with locale-aware style (₦32,000.00)
 */
export function convertCurrency(
  source: CurrencyCode,
  target: CurrencyCode,
  amount: number | string,
  rates: CurrencyRates,
  showSymbol = false,
  useLocale = false
): ConvertedResult {
  const symbol = getCurrencySymbol(target) || "";
  const locale =
    typeof navigator !== "undefined" ? navigator.language : "en-US";

  // Parse amount safely (handles strings, commas, decimals)
  const parsedAmount = (() => {
    if (typeof amount === "number") return amount;
    if (typeof amount === "string") {
      const cleaned = amount.replace(/,/g, "").trim();
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  })();

  // Handle missing rates gracefully
  if (!rates[source] || !rates[target]) {
    console.warn(`Missing currency rate for ${source} or ${target}`);
    return {
      amount: parsedAmount,
      symbol,
      formatted: showSymbol
        ? `${symbol}${parsedAmount.toFixed(2)}`
        : parsedAmount.toFixed(2),
    };
  }

  // Auto-detect base and adjust math dynamically
  const baseCurrency = Object.keys(rates).find((key) => rates[key] === 1);
  let convertedValue: number;

  if (baseCurrency === source) {
    convertedValue = parsedAmount * rates[target];
  } else if (baseCurrency === target) {
    convertedValue = parsedAmount / rates[source];
  } else {
    convertedValue = (parsedAmount / rates[source]) * rates[target];
  }

  const rounded = parseFloat(convertedValue.toFixed(2));

  const formatted = useLocale
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: target,
      }).format(rounded)
    : showSymbol
    ? `${symbol}${rounded.toLocaleString()}`
    : rounded.toLocaleString();

  return { amount: rounded, symbol, formatted };
}

/**
 * React hook to easily perform currency conversion using app context rates.
 */
export function useCurrencyConverter() {
  const { rates } = useAppContext();

  return (
    source: CurrencyCode,
    target: CurrencyCode,
    amount: number | string,
    showSymbol = false,
    useLocale = false
  ): ConvertedResult => {
    const symbol = getCurrencySymbol(target) || "";

    // Parse amount safely
    const parsedAmount = (() => {
      if (typeof amount === "number") return amount;
      if (typeof amount === "string") {
        const cleaned = amount.replace(/,/g, "").trim();
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    })();

    if (!rates) {
      return {
        amount: parsedAmount,
        symbol,
        formatted: showSymbol
          ? `${symbol}${parsedAmount.toFixed(2)}`
          : parsedAmount.toFixed(2),
      };
    }

    return convertCurrency(
      source,
      target,
      parsedAmount,
      rates,
      showSymbol,
      useLocale
    );
  };
}
