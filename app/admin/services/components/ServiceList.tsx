"use client";

import { useEffect, useMemo, useState } from "react";
import ServiceDetailsModal from "./ServiceDetailsModal";
import ServiceCard from "./ServiceCard";
import ServiceTable from "./ServiceTable";
import { Service } from "@/types";
import ServiceFilters from "./ServiceFilters";
import {
  useDeleteService,
  useDeleteMultipleServices,
  useGetServicesByAdmin,
} from "@/hooks/use-services";
import Loading from "@/app/loading";
import { EmptyState } from "@/components/empty-state";
import { Shield } from "lucide-react";
import Pagination from "@/components/pagination";
import DeleteDialog from "../../users/components/DeleteDialog";

export default function ServiceList() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    search: "",
    status: "All",
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: servicesData, isLoading } = useGetServicesByAdmin();
  const { mutate: deleteService } = useDeleteService();
  const { mutate: deleteMultipleServices } = useDeleteMultipleServices();

  useEffect(() => {
    if (servicesData) {
      setServices(servicesData);
    }
  }, [servicesData]);

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

  const sorted = useMemo(() => {
    const arr = [...filteredServices];
    return arr;
  }, [filteredServices]);

  const current = sorted.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) return <Loading />;

  if (!services || services.length === 0) {
    return (
      <EmptyState
        icon={Shield}
        title="No Service Found"
        description="No services have been placed yet."
      />
    );
  }

  const handleEdit = (service: Service) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setSelectedService(service);
  };

  const handleDeleteSingle = (id: number) => {
    setDeleteIds([id]);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    const usersUids = current
      .filter((u) => deleteIds.includes(u.storeScopedId))
      .map((u) => u.uid);
    deleteMultipleServices({ uids: usersUids });
    setServices((prev) =>
      prev.filter((u) => !deleteIds.includes(u.storeScopedId))
    );
    setSelected((prev) => prev.filter((id) => !deleteIds.includes(id)));
    setDeleteIds([]);
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    setDeleteIds(selected);
    setDeleteOpen(true);
  };

  const namesForDelete = current
    .filter((u) => deleteIds.includes(u.storeScopedId))
    .map((u) => u.name);

  const onToggleStatus = () => {};

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

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
          services={current}
          onEdit={handleEdit}
          onDeleteSingle={handleDeleteSingle}
          onToggleStatus={onToggleStatus}
        />
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        <ServiceCard
          services={current}
          onEdit={handleEdit}
          onDeleteSingle={handleDeleteSingle}
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

      {/* Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={sorted.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 20, 50]}
      />

      {/* Delete dialog */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        count={deleteIds.length}
        names={namesForDelete}
        entityName="service"
      />
    </div>
  );
}
