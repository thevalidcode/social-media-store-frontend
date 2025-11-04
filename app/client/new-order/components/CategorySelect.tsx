import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { ServiceCategory } from "@/types";

interface Props {
  value: string;
  onChange: (v: string) => void;
  categories: ServiceCategory[];
}

export const CategorySelect: React.FC<Props> = ({
  value,
  onChange,
  categories,
}) => {
  return (
    <div className="flex-1 min-w-0 w-full gap-2 flex flex-col">
      <Label htmlFor="category">Category</Label>
      <Select value={value} onValueChange={(v: string) => onChange(v)}>
        <SelectTrigger id="category" className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {categories.map((c) => (
              <SelectItem key={c.title} value={c.title}>
                <div className="flex items-center gap-3">
                  <img
                    src={c.icon}
                    alt={c.title}
                    className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="font-medium truncate">{c.title}</div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
