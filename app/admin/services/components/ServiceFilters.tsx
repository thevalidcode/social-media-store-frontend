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
import { FeatureGate } from "@/components/FeatureGate";
import { useAppContext } from "@/context/appContext";

interface ServiceFiltersProps {
  categories: string[];
  onFilterChange: (filters: {
    category: string;
    search: string;
    status: string;
  }) => void;
  addService: () => void;
  canAddMore?: boolean;
  maxProducts?: number;
  hasUnlimited?: boolean;
}

export default function ServiceFilters({
  categories,
  onFilterChange,
  addService,
  canAddMore = true,
  maxProducts = 0,
  hasUnlimited = false,
}: ServiceFiltersProps) {
  const { storeInfo } = useAppContext();
  const isSubscriptionActive = storeInfo?.subscriptionStatus === "ACTIVE";
  
  const [filters, setFilters] = useState({
    category: "All",
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
        {/* Category Filter */}
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            name="search"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search service..."
            className="pl-8 w-full border rounded-md p-2 text-sm"
          />
        </div>
      </div>
      <FeatureGate
        isAllowed={isSubscriptionActive}
        featureLabel="Service Creation"
        variant="tooltip"
        description="You need an active subscription to add services. Please renew your subscription to continue."
      >
        <FeatureGate
          isAllowed={canAddMore}
          featureLabel="Service limit"
          variant="tooltip"
          description={hasUnlimited ? "" : `You've reached the maximum of ${maxProducts} services/products. Upgrade to add more.`}
        >
          <Button
            type="button"
            className="bg-primary text-white hover:bg-primary/90 rounded-sm py-2 px-4 cursor-pointer"
            onClick={addService}
          >
            Add Service
          </Button>
        </FeatureGate>
      </FeatureGate>
    </div>
  );
}
