"use client";

import * as React from "react";
import { currency } from "@/app/_docs/doc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppContext } from "@/context/appContext";

export default function CurrencySelect() {
  const [search, setSearch] = React.useState("");
  const { setUserCurrency, userCurrency } = useAppContext();

  // Filter dynamically based on search term
  const filteredCurrencies = Object.entries(currency).filter(
    ([code, name]) =>
      code.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Select value={userCurrency} onValueChange={setUserCurrency}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>

      <SelectContent className="max-h-80 w-[320px]">
        <div className="p-2">
          <Input
            placeholder="Search currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        <ScrollArea className="max-h-64">
          {filteredCurrencies.length === 0 ? (
            <div className="text-sm text-muted-foreground p-3 text-center">
              No currency found
            </div>
          ) : (
            filteredCurrencies.map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {code} - {name}
              </SelectItem>
            ))
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
