import Decimal from "decimal.js";
import { currency, getCurrencySymbol } from "@/app/_docs/doc";
import { useAppContext } from "@/context/appContext";

export type CurrencyCode = keyof typeof currency;

export interface CurrencyRates {
  [key: string]: number;
}

export interface ConvertedResult {
  amount: string; // store as string for precision
  symbol: string;
  formatted: string;
}

/**
 * Converts an amount from one currency to another using Decimal for precise math.
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

  // Parse amount safely with Decimal
  const parsedAmount = (() => {
    if (typeof amount === "number") return new Decimal(amount);
    if (typeof amount === "string") {
      const cleaned = amount.replace(/,/g, "").trim();
      return new Decimal(cleaned || 0);
    }
    return new Decimal(0);
  })();

  // Handle missing rates gracefully
  if (!rates[source] || !rates[target]) {
    const formatted = showSymbol
      ? `${symbol}${parsedAmount.toNumber().toLocaleString(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : parsedAmount.toNumber().toLocaleString(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
    return { amount: parsedAmount.toFixed(2), symbol, formatted };
  }

  // Detect base currency (rate = 1)
  const baseCurrency = Object.keys(rates).find((key) => rates[key] === 1);
  let convertedValue: Decimal;

  const sourceRate = new Decimal(rates[source]);
  const targetRate = new Decimal(rates[target]);

  if (baseCurrency === source) {
    convertedValue = parsedAmount.mul(targetRate);
  } else if (baseCurrency === target) {
    convertedValue = parsedAmount.div(sourceRate);
  } else {
    convertedValue = parsedAmount.div(sourceRate).mul(targetRate);
  }

  const rounded = convertedValue.toDecimalPlaces(2);

  const formatted = useLocale
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: target,
      }).format(Number(rounded.toString()))
    : showSymbol
    ? `${symbol}${Number(rounded.toString()).toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : Number(rounded.toString()).toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return { amount: rounded.toString(), symbol, formatted };
}

/**
 * React hook for currency conversion using app context rates.
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

    const parsedAmount =
      typeof amount === "string"
        ? new Decimal(amount.replace(/,/g, "").trim() || 0)
        : new Decimal(amount || 0);

    if (!rates) {
      const formatted = showSymbol
        ? `${symbol}${parsedAmount.toNumber().toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : parsedAmount.toNumber().toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
      return { amount: parsedAmount.toFixed(2), symbol, formatted: formatted };
    }

    return convertCurrency(
      source,
      target,
      parsedAmount.toString(),
      rates,
      showSymbol,
      useLocale
    );
  };
}
