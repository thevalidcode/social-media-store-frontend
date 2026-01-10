"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceCategory } from "@/types";

export const CategorySelector = ({
  categories,
  value,
  onChange,
}: {
  categories: ServiceCategory[];
  value: string;
  onChange: (v: string) => void;
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories.map((cat) => (
            <SelectItem key={cat.title} value={cat.title}>
              <div className="flex items-center gap-3">
                {cat.icon && (
                  <img
                    src={cat.icon}
                    alt={cat.title}
                    className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                  />
                )}
                <div className="font-medium truncate">{cat.title}</div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
