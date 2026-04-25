"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search } from "lucide-react";

interface ProvidersHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  selectedCount: number;
  allSelected: boolean;
  onSelectAll: () => void;
  canManageProviders: boolean;
}

export function ProvidersHeader({
  search,
  onSearchChange,
  onCreateClick,
  selectedCount,
  allSelected,
  onSelectAll,
  canManageProviders,
}: ProvidersHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Providers</h1>
        <p className="text-sm text-muted-foreground">
          Manage provider connections, sync behavior, and import percentages.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by provider name or URL"
            className="pl-9"
          />
        </div>

        <Button variant="outline" onClick={onSelectAll} className="gap-2">
          <Checkbox checked={allSelected} />
          {selectedCount > 0 ? `Selected (${selectedCount})` : "Select all"}
        </Button>

        <Button onClick={onCreateClick} disabled={!canManageProviders}>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>
    </div>
  );
}
