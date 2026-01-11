"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { PaymentFilters } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";

interface PaymentFiltersBarProps {
  onFiltersChange: (filters: PaymentFilters & { search?: string }) => void;
}

export function PaymentFiltersBar({ onFiltersChange }: PaymentFiltersBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PaymentFilters>({});

  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleStatusChange = (value: string) => {
    const newFilters = {
      ...filters,
      status: value === "all" ? undefined : (value as any),
    };
    setFilters(newFilters);
    onFiltersChange({ ...newFilters, search: debouncedSearch || undefined });
  };

  const handleMethodChange = (value: string) => {
    const newFilters = {
      ...filters,
      method: value === "all" ? undefined : (value as any),
    };
    setFilters(newFilters);
    onFiltersChange({ ...newFilters, search: debouncedSearch || undefined });
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
    onFiltersChange({});
  };

  // Update filters when search changes
  React.useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearch || undefined });
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="SUCCESS">Success</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
        </SelectContent>
      </Select>

      {/* Method Filter */}
      <Select value={filters.method || "all"} onValueChange={handleMethodChange}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Methods</SelectItem>
          <SelectItem value="FLUTTERWAVE">Flutterwave</SelectItem>
          <SelectItem value="PAYSTACK">Paystack</SelectItem>
          <SelectItem value="MANUAL">Manual</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {(filters.status || filters.method || searchQuery) && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}
