"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/types";

export const SortSelector = ({
  options,
  value,
  onChange,
}: {
  options: SortOption[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Sort..." />
    </SelectTrigger>
    <SelectContent>
      {options.map((s) => (
        <SelectItem key={s.value} value={s.value}>
          {s.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
