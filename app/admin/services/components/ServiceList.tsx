"use client";

import { useState } from "react";
import ServiceDetailsModal from "./ServiceDetailsModal";
import ServiceCard from "./ServiceCard";
import ServiceTable from "./ServiceTable";
import { Service } from "@/types";
import ServiceFilters from "./ServiceFilters";

export default function ServiceList() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    search: "",
    status: "All",
  });

  const [services] = useState<Service[]>([
    {
      id: 1,
      name: "Instagram Followers",
      icon: "https://images.unsplash.com/photo-1520975919757-6a7a1f0b8f62?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
      category: "Instagram",
      type: "Default",
      price: 12.5,
      min: 100,
      max: 10000,
      status: "active",
      description: "Real followers with refill guarantee.",
    },
    {
      id: 2,
      name: "YouTube Views",
      icon: "https://images.unsplash.com/photo-1520975919757-6a7a1f0b8f62?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
      category: "YouTube",
      type: "Package",
      price: 20.0,
      min: 500,
      max: 50000,
      status: "disabled",
      description: "High retention views with drip feed support.",
    },
  ]);

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const handleDelete = () => {};
  const onToggleStatus = () => {};

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredServices = services.filter((s) => {
    const matchesCategory =
      filters.category === "All" || s.category === filters.category;
    const matchesSearch = s.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesStatus =
      filters.status === "All" || s.status === filters.status;
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="space-y-6">
      <ServiceFilters
        categories={categories}
        onFilterChange={handleFilterChange}
      />
      {/* Desktop Table */}
      <div className="hidden md:block">
        <ServiceTable
          services={filteredServices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={onToggleStatus}
        />
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        <ServiceCard
          services={filteredServices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={onToggleStatus}
        />
      </div>

      {/* Modal */}
      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          isOpen={isModalOpen}
          onEdit={handleEdit}
          isEditing={isEditing}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
