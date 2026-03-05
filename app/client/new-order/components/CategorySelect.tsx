import React from "react";
import { SelectWithSearch, SelectOption } from "@/components/ui/select-with-search";
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
  const categoryOptions: SelectOption[] = categories.map((c) => ({
    value: c.title,
    label: c.title,
    icon: c.icon,
  }));

  return (
    <div className="flex-1 min-w-0 w-full gap-2 flex flex-col">
      <Label htmlFor="category">Category</Label>
      <SelectWithSearch
        value={value}
        onValueChange={(v: string) => onChange(v)}
        placeholder="Select category"
        searchPlaceholder="Search categories..."
        options={categoryOptions}
        className="w-full"
        renderOption={(option) => (
          <>
            {option.icon && (
              <img
                src={option.icon}
                alt={option.label}
                className="w-8 h-8 rounded-md object-cover flex-shrink-0"
              />
            )}
            <div className="font-medium truncate">{option.label}</div>
          </>
        )}
      />
    </div>
  );
};
