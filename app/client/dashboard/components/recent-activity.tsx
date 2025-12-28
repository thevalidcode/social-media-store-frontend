"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Service } from "@/types";
import ServiceList from "@/app/client/services/components/ServicesList";
import { useMemo } from "react";
import { groupServicesByCategory } from "@/lib/groupServices";

interface RecentActivityProps {
  services?: Service[];
  categories?: Category[];
}

export default function RecentActivity({
  services = [],
  categories = [],
}: RecentActivityProps) {
  const categorizedServices = useMemo(() => {
    return groupServicesByCategory(services, categories);
  }, [services]);

  return (
    services &&
    categories && (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">
            Recent Activity
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recently Added Services
          </p>
        </CardHeader>
        <div className="px-4">
          <ServiceList
            showControls={false}
            categoryWithServices={categorizedServices}
          />
        </div>
      </Card>
    )
  );
}
