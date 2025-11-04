"use client";
import React from "react";
import { Label } from "@/components/ui/label";
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
}) => (
  <div className="flex items-center gap-4 w-full md:w-auto">
    <Label className="min-w-[88px]">Category</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[min(420px,100%)]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories.map((cat) => (
            <SelectItem key={cat.title} value={cat.title}>
              <div className="flex items-center gap-3">
                <img
                  src={
                    cat.icon ??
                    `https://picsum.photos/seed/${encodeURIComponent(
                      cat.title
                    )}/64`
                  }
                  alt={cat.title}
                  className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                />
                <div className="font-medium truncate">{cat.title}</div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);
