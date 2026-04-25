"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

interface PaymentMethodsHeaderProps {
  onCreateClick: () => void;
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  canAddMoreGateways: boolean;
}

export function PaymentMethodsHeader({
  onCreateClick,
  search,
  status,
  onSearchChange,
  onStatusChange,
  canAddMoreGateways,
}: PaymentMethodsHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment Methods</h1>
        <p className="text-sm text-muted-foreground">
          Configure gateways, limits, fees, and the currency each gateway uses for min/max values.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or platform"
            className="pl-9"
          />
        </div>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DISABLED">Disabled</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onCreateClick} disabled={!canAddMoreGateways}>
          <Plus className="mr-2 h-4 w-4" />
          Add Gateway
        </Button>
      </div>
    </div>
  );
}
