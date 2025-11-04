"use client";

import { useGetServicesByPublic } from "@/hooks/use-services";
import ServicesList from "./components/ServicesList";
import { groupServicesByCategory } from "@/lib/groupServices";
import Loading from "@/app/loading";
import { Server } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function ServicesPage() {
  const { data: services, isLoading } = useGetServicesByPublic();

  if (isLoading) {
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

  const categoryWithServices = groupServicesByCategory(services!);
  return (
    <div>
      <ServicesList categoryWithServices={categoryWithServices} />
    </div>
  );
}
