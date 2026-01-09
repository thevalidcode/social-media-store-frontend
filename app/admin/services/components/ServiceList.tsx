"use client";

import { useEffect, useMemo, useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceTable from "./ServiceTable";
import { Service, ServiceStatus } from "@/types";
import ServiceFilters from "./ServiceFilters";
import {
  useDeleteMultipleServices,
  useGetServicesByAdmin,
  useUpdateService,
} from "@/hooks/use-services";
import Loading from "@/app/loading";
import { EmptyState } from "@/components/empty-state";
import { Shield } from "lucide-react";
import Pagination from "@/components/pagination";
import DeleteDialog from "../../components/DeleteDialog";
import AddService from "./ServiceDialog";
import ServiceDialog from "./ServiceDialog";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";

export default function ServiceList() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filters, setFilters] = useState({
    category: "All",
    search: "",
    status: "All",
  });
  const [services, setServices] = useState<Service[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: servicesData, isLoading } = useGetServicesByAdmin();
  const { mutate: deleteMultipleServices } = useDeleteMultipleServices();
  const { mutate: updateService } = useUpdateService();
  const { storeInfo } = useAppContext();

  const hasUnlimitedProducts = storeInfo?.features?.unlimited_products ?? false;
  const maxProducts = storeInfo?.features?.products ?? 0;
  const canAddMoreServices =
    hasUnlimitedProducts || services.length < maxProducts;

  const handleAddServiceClick = () => {
    if (!canAddMoreServices) {
      toast.error(
        `You can only add up to ${maxProducts} services/products. Upgrade your plan for more.`
      );
      return;
    }
    setOpen(true);
    setSelectedService(null);
  };

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
      <>
        <EmptyState
          icon={Shield}
          title="No Service Found"
          description="No services have been created yet."
          actionLabel="Create Service"
          onAction={handleAddServiceClick}
          maxAmount={maxProducts}
          canAddMore={canAddMoreServices}
          featureLabel="Service limit"
          tooltipDescription={`You've reached the maximum of ${maxProducts} services. Upgrade to add more.`}
        />
        <AddService open={open} setOpen={setOpen} />
      </>
    );
  }

  const handleEdit = (service: Service) => {
    setOpen(true);
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
    setDeleteIds([]);
  };

  const namesForDelete = current
    .filter((u) => deleteIds.includes(u.storeScopedId))
    .map((u) => u.name);

  const onToggleStatus = (serviceId: number, newStatus: ServiceStatus) => {
    if (!selectedService) return;

    setServices((prevServices) =>
      prevServices.map((service) =>
        service.storeScopedId === serviceId
          ? { ...service, status: newStatus }
          : service
      )
    );
    updateService({ ...selectedService, status: newStatus });
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="space-y-6">
      <ServiceFilters
        categories={categories}
        onFilterChange={handleFilterChange}
        addService={handleAddServiceClick}
        canAddMore={canAddMoreServices}
        maxProducts={maxProducts}
        hasUnlimited={hasUnlimitedProducts}
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

      <ServiceDialog
        editingItem={selectedService}
        open={open}
        setOpen={setOpen}
      />

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
