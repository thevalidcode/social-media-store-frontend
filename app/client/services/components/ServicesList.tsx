"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { sortBy } from "@/app/_docs/doc";
import { Service, ServiceCategory } from "@/types";
import { SortOption } from "@/types";

import { CategorySelector } from "./CategorySelector";
import { SortSelector } from "./SortSelector";
import { ServicesTableDesktop } from "./ServicesListDesktop";
import { ServicesCardsMobile } from "./ServiceCardMobile";
import { ServiceDialog } from "./ServiceDialog";
import { PageContent } from "@/app/(root)/components/page-content";
import Pagination from "@/components/pagination";
import { Search } from "lucide-react";

type Props = {
  categoryWithServices?: ServiceCategory[];
  showControls?: boolean;
};

export default function ServicesList({
  categoryWithServices = [],
  showControls = true,
}: Props) {
  const router = useRouter();
  const CATEGORIES = (categoryWithServices as ServiceCategory[]) ?? [];
  const SORT_BY = (sortBy as SortOption[]) ?? [{ value: "id", label: "ID" }];

  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>(
    SORT_BY[0]?.value ?? "id"
  );

  const [open, setOpen] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [modalQty, setModalQty] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (title: string) => {
    setSelectedCategoryTitle(title);
    setPage(1); // Reset to first page when category changes
  };

  const handleSortChange = (v: string) => setSelectedSort(v);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  };

  const sortedServices = useMemo(() => {
    // Get services based on selected category
    let list: Service[] = [];
    if (selectedCategoryTitle === "all") {
      // Flatten all services from all categories
      list = CATEGORIES.flatMap(cat => cat.services ?? []);
    } else {
      const selectedCategory = CATEGORIES.find((c) => c.title === selectedCategoryTitle);
      list = [...(selectedCategory?.services ?? [])];
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (selectedSort) {
      case "alphabetical":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "id":
        return list.sort((a, b) => a.storeScopedId - b.storeScopedId);
      default:
        return list;
    }
  }, [selectedCategoryTitle, selectedSort, searchQuery, CATEGORIES]);

  const paginatedServices = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedServices.slice(startIndex, startIndex + pageSize);
  }, [sortedServices, page, pageSize]);

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

  const navigateToNewOrder = (
    categoryIdentifier: string,
    serviceId: number
  ) => {
    const params = new URLSearchParams();
    params.set("category", categoryIdentifier);
    params.set("service", String(serviceId));
    params.set("quantity", String(modalQty));
    setActiveService(null);
    setOpen(false);
    router.push(`/client/new-order?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Content */}
      <PageContent pageType="SERVICES" />

      {/* Controls */}
      {showControls && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-xl shadow-sm border">
          {/* Left Side - Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <CategorySelector
              categories={CATEGORIES}
              value={selectedCategoryTitle}
              onChange={handleCategoryChange}
            />
            <SortSelector
              options={SORT_BY}
              value={selectedSort}
              onChange={handleSortChange}
            />
          </div>
          {/* Right Side - Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search services..."
              className="pl-9 pr-3 py-2 w-full border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>
      )}

      {/* Desktop */}
      <ServicesTableDesktop
        services={paginatedServices}
        openModal={openModal}
        navigateToNewOrder={navigateToNewOrder}
      />

      {/* Mobile */}
      <ServicesCardsMobile
        services={paginatedServices}
        openModal={openModal}
        navigateToNewOrder={navigateToNewOrder}
      />

      {/* Pagination */}
      {sortedServices.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={sortedServices.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[50, 100, 200]}
        />
      )}

      {/* Dialog */}
      <ServiceDialog
        open={open}
        onClose={closeModal}
        activeService={activeService}
        modalQty={modalQty}
        setModalQty={setModalQty}
        navigateToNewOrder={navigateToNewOrder}
      />
    </div>
  );
}
