"use client";

import * as React from "react";
import { currency } from "@/app/_docs/doc";
import { SelectWithSearch, SelectOption } from "@/components/ui/select-with-search";
import { useAppContext } from "@/context/appContext";

export default function CurrencySelect() {
  const { setUserCurrency, userCurrency } = useAppContext();

  const currencyOptions: SelectOption[] = Object.entries(currency).map(([code, name]) => ({
    value: code,
    label: `${code} - ${name.split("|")[0]}`,
  }));

  return (
    <SelectWithSearch
      value={userCurrency}
      onValueChange={setUserCurrency}
      placeholder="Select currency"
      searchPlaceholder="Search currency..."
      options={currencyOptions}
      emptyMessage="No currency found"
      className="w-full"
    />
  );
}
