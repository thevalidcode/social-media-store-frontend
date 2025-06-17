"use client";

import { serviceCategories, sortBy } from "../../_docs/doc";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";

// Types for service and category
interface Service {
  id: number;
  name: string;
  pricePer1000: number;
  min: number;
  max: number;
  description: string;
}
interface ServiceCategory {
  title: string;
  services: Service[];
}

// ServicesTable renders a category select, sort select, and a table of services
export function ServicesTable() {
  // State for selected category and sort
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(
    serviceCategories[0]
  );
  const [selectedSort, setSelectedSort] = useState<string>(sortBy[0].value);

  // Handle category change
  const handleCategoryChange = (title: string) => {
    const cat = serviceCategories.find(
      (c: ServiceCategory) => c.title === title
    );
    if (cat) setSelectedCategory(cat);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  // Sort services based on selectedSort
  const sortedServices: Service[] = useMemo(() => {
    const services = [...selectedCategory.services];
    switch (selectedSort) {
      case "alphabetical":
        return services.sort((a, b) => a.name.localeCompare(b.name));
      case "id":
        return services.sort((a, b) => a.id - b.id);
      case "date":
        return services; // No date field, so no-op
      default:
        return services;
    }
  }, [selectedCategory, selectedSort]);

  if (!serviceCategories.length) return <div>No categories found.</div>;

  return (
    <div className="space-y-4">
      {/* Category and Sort Selects */}
      <div className="flex gap-4 items-center">
        {/* Category Select */}
        <Select
          value={selectedCategory.title}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map((cat: ServiceCategory) => (
              <SelectItem key={cat.title} value={cat.title}>
                {cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Sort Select */}
        <Select value={selectedSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort..." />
          </SelectTrigger>
          <SelectContent>
            {sortBy.map((s: { value: string; label: string }) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Services Table */}
      <Table className="rounded-lg border border-border bg-card">
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">ID</TableHead>
            <TableHead>Category & Service</TableHead>
            <TableHead className="w-40">Price Per 1000</TableHead>
            <TableHead className="w-32">Min - Max</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedServices.map((service: Service) => (
            <TableRow key={service.id}>
              <TableCell>{service.id}</TableCell>
              <TableCell>
                <div className="font-medium">{selectedCategory.title}</div>
                <div className="text-muted-foreground text-sm">
                  {service.name}
                </div>
              </TableCell>
              <TableCell>
                $
                {service.pricePer1000.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 3,
                })}
              </TableCell>
              <TableCell>
                {service.min} - {service.max}
              </TableCell>
              <TableCell>
                <button className="px-3 py-1 rounded bg-muted text-foreground hover:bg-accent transition text-xs">
                  Description
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
