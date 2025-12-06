"use client";

import { useGetServicesByPublic } from "@/hooks/use-services";
import ServicesList from "./components/ServicesList";
import { groupServicesByCategory } from "@/lib/groupServices";
import Loading from "@/app/loading";
import { Server } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useGetCategories } from "@/hooks/use-category";

export default function ServicesPage() {
  const { data: services, isLoading } = useGetServicesByPublic();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();

  if (isLoading || isCategoriesLoading) {
    return <Loading />;
  }

  if (!services || services.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="No Service Found"
        description="No service has been created yet."
      />
    );
  }

  const categoryWithServices = groupServicesByCategory(services!, categories!);
  return (
    <div>
      <ServicesList categoryWithServices={categoryWithServices} />
    </div>
  );
}
