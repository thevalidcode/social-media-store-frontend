"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { serviceCategories, sortBy } from "@/app/_docs/doc";
import { Service, ServiceCategory } from "@/types";
import { SortOption } from "@/types";

import { CategorySelector } from "./CategorySelector";
import { SortSelector } from "./SortSelector";
import { ServicesTableDesktop } from "./ServicesListDesktop";
import { ServicesCardsMobile } from "./ServiceCardMobile";
import { ServiceDialog } from "./ServiceDialog";

type Props = {
  categoryWithServices?: ServiceCategory[];
  showControls?: boolean;
};

export default function ServicesList({
  categoryWithServices = serviceCategories,
  showControls = true,
}: Props) {
  const router = useRouter();
  const CATEGORIES = (categoryWithServices as ServiceCategory[]) ?? [];
  const SORT_BY = (sortBy as SortOption[]) ?? [{ value: "id", label: "ID" }];

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(
    CATEGORIES[0]
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    SORT_BY[0]?.value ?? "id"
  );

  const [open, setOpen] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [modalQty, setModalQty] = useState<number>(1);

  const handleCategoryChange = (title: string) => {
    const cat = CATEGORIES.find((c) => c.title === title);
    if (cat) setSelectedCategory(cat);
  };

  const handleSortChange = (v: string) => setSelectedSort(v);

  const sortedServices = useMemo(() => {
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
      {/* Controls */}
      {showControls && selectedCategory && (
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <CategorySelector
            categories={CATEGORIES}
            value={selectedCategory.title}
            onChange={handleCategoryChange}
          />
          <SortSelector
            options={SORT_BY}
            value={selectedSort}
            onChange={handleSortChange}
          />
        </div>
      )}

      {/* Table */}
      <ServicesTableDesktop
        services={sortedServices}
        openModal={openModal}
        navigateToNewOrder={navigateToNewOrder}
      />

      {/* Mobile */}
      <ServicesCardsMobile
        services={sortedServices}
        openModal={openModal}
        navigateToNewOrder={navigateToNewOrder}
      />

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
