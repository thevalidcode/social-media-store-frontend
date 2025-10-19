"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type SortOption = { value: string; label: string };

export interface Service {
  id: number;
  name: string;
  pricePer1000: number;
  min: number;
  max: number;
  description: string;
  img?: string;
}

export interface ServiceCategory {
  id?: string; // optional if your doc provides it
  title: string;
  img?: string;
  services: Service[];
}

const CATEGORIES = (serviceCategories as ServiceCategory[]) ?? [];
const SORT_BY = (sortBy as SortOption[]) ?? [{ value: "id", label: "ID" }];

export function ServicesTable() {
  const router = useRouter();

  if (!CATEGORIES || CATEGORIES.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No categories found.</div>
    );
  }

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(
    CATEGORIES[0]
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    SORT_BY[0]?.value ?? "id"
  );

  // modal state
  const [open, setOpen] = useState<boolean>(false);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [modalQty, setModalQty] = useState<number>(1);

  const handleCategoryChange = (title: string) => {
    const cat = CATEGORIES.find((c) => c.title === title || c.id === title);
    if (cat) setSelectedCategory(cat);
  };

  const handleSortChange = (value: string) => setSelectedSort(value);

  const sortedServices = useMemo<Service[]>(() => {
    const list = [...(selectedCategory?.services ?? [])];
    switch (selectedSort) {
      case "alphabetical":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "id":
        return list.sort((a, b) => a.id - b.id);
      default:
        return list;
    }
  }, [selectedCategory, selectedSort]);

  const fmtPrice = (n: number) =>
    `$${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    })}`;

  const openModal = (service: Service) => {
    setActiveService(service);
    setModalQty(Math.max(1, service.min ?? 1));
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActiveService(null);
    setModalQty(1);
  };

  // NAVIGATE to New Order page with params (category + service)
  const navigateToNewOrder = (
    categoryIdentifier: string,
    serviceId: number
  ) => {
    const params = new URLSearchParams();
    params.set("category", categoryIdentifier);
    params.set("service", String(serviceId));
    router.push(`/client/new-order?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Label className="min-w-[88px]">Category</Label>
          <Select
            value={selectedCategory.title}
            onValueChange={(v: string) => handleCategoryChange(v)}
          >
            <SelectTrigger className="w-[min(420px,100%)]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.title} value={cat.title}>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          cat.img ??
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

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Label className="min-w-[60px]">Sort</Label>
          <Select
            value={selectedSort}
            onValueChange={(v: string) => handleSortChange(v)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Sort..." />
            </SelectTrigger>
            <SelectContent>
              {SORT_BY.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table className="rounded-lg border border-border bg-card overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="w-44">Price Per 1000</TableHead>
              <TableHead className="w-36">Min - Max</TableHead>
              <TableHead className="w-36">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedServices.map((service) => (
              <TableRow
                key={service.id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-mono text-sm">
                  {service.id}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        service.img ??
                        `https://picsum.photos/seed/service-${service.id}/64`
                      }
                      alt={service.name}
                      className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{service.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {selectedCategory.title}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="font-medium">
                    {fmtPrice(service.pricePer1000)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    per 1000 units
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    {service.min} - {service.max}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(service)}
                    >
                      Description
                    </Button>

                    {/* NAVIGATE to NewOrder with params (category identifier is category title here) */}
                    <Button
                      size="sm"
                      onClick={() =>
                        navigateToNewOrder(
                          selectedCategory.id ?? selectedCategory.title,
                          service.id
                        )
                      }
                    >
                      Order
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {sortedServices.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: idx * 0.03 }}
            className="bg-card border border-border rounded-xl shadow-sm p-4"
          >
            <div className="flex gap-4">
              <img
                src={
                  service.img ??
                  `https://picsum.photos/seed/service-${service.id}/120`
                }
                alt={service.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold truncate">{service.name}</div>
                  <div className="text-sm font-mono">{service.id}</div>
                </div>

                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {selectedCategory.title}
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <div className="text-sm">
                    {fmtPrice(service.pricePer1000)} / 1000
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(service)}
                    >
                      Description
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        navigateToNewOrder(
                          selectedCategory.id ?? selectedCategory.title,
                          service.id
                        )
                      }
                    >
                      Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>{activeService?.name}</DialogTitle>
            <DialogDescription>{activeService?.description}</DialogDescription>
          </DialogHeader>

          {activeService && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="md:col-span-1">
                <img
                  src={
                    activeService.img ??
                    `https://picsum.photos/seed/service-${activeService.id}/600`
                  }
                  alt={activeService.name}
                  className="w-full h-44 object-cover rounded-lg"
                />
                <div className="mt-3 text-sm text-muted-foreground">
                  Per 1000: {fmtPrice(activeService.pricePer1000)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Per unit: ${(activeService.pricePer1000 / 1000).toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Min: {activeService.min} — Max: {activeService.max}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col">
                <Label htmlFor="modal-qty">Quantity</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setModalQty((q) =>
                        Math.max(activeService?.min ?? 1, Math.max(1, q - 1))
                      )
                    }
                  >
                    -
                  </Button>
                  <Input
                    id="modal-qty"
                    type="number"
                    min={activeService.min}
                    max={activeService.max}
                    value={modalQty}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setModalQty(parseInt(e.target.value || "0", 10) || 0)
                    }
                    className="w-32 text-center"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setModalQty((q) =>
                        Math.min(
                          activeService?.max ?? Number.MAX_SAFE_INTEGER,
                          q + 1
                        )
                      )
                    }
                  >
                    +
                  </Button>

                  <div className="ml-auto text-right">
                    <div className="text-sm text-muted-foreground">
                      Estimated
                    </div>
                    <div className="font-semibold">
                      $
                      {((activeService.pricePer1000 / 1000) * modalQty).toFixed(
                        2
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 ml-auto">
                  <Button variant="ghost" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      navigateToNewOrder(
                        selectedCategory.id ?? selectedCategory.title,
                        activeService.id
                      )
                    }
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  );
}
