// lib/groupServices.ts
import { Service, ServiceCategory } from "@/types";

export function groupServicesByCategory(
  services: Service[]
): ServiceCategory[] {
  const grouped: Record<string, Service[]> = {};

  services.forEach((service) => {
    if (!grouped[service.category]) {
      grouped[service.category] = [];
    }
    grouped[service.category].push(service);
  });

  return Object.entries(grouped).map(([category, services]) => ({
    title: category,
    icon: services[0]?.icon || "https://picsum.photos/seed/default/64",
    services,
  }));
}
