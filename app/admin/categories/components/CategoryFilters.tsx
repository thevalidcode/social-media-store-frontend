"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CategoryFiltersProps {
  onFilterChange: (filters: { search: string; status: string }) => void;
  addCategory: () => void;
}

export default function CategoryFilters({
  onFilterChange,
  addCategory,
}: CategoryFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const handleFilterChange = (name: string, value: string) => {
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-xl shadow-sm border">
      {/* Left Side - Filters */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DISABLED">Disabled</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            name="search"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search category..."
            className="pl-8 w-full border rounded-md p-2 text-sm"
          />
        </div>
      </div>

      <Button
        type="button"
        className="bg-primary text-white hover:bg-primary/90 rounded-sm py-2 px-4 cursor-pointer"
        onClick={addCategory}
      >
        Add Category
      </Button>
    </div>
  );
}
