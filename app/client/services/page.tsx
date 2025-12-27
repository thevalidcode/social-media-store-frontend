"use client";

import { useGetServicesByPublic } from "@/hooks/use-services";
import ServicesList from "./components/ServicesList";
import { groupServicesByCategory } from "@/lib/groupServices";
import Loading from "@/app/loading";
import { Server } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useGetCategories } from "@/hooks/use-category";
import { TypographyH2 } from "@/components/typography";
import { Shield } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <TypographyH2 className="mb-0">Available Services</TypographyH2>
      </div>
      <ServicesList categoryWithServices={categoryWithServices} />
    </div>
  );
}
