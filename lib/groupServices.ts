import { Category, Service, ServiceCategory } from "@/types";

export function groupServicesByCategory(
  services: Service[],
  categories: Category[]
): ServiceCategory[] {
  const grouped: Record<string, Service[]> = {};

  const categoryMeta: Record<string, { name: string; icon: string }> = {};

  categories?.forEach((cat) => {
    categoryMeta[cat.name] = {
      name: cat.name,
      icon: cat.icon!,
    };
  });

  services.forEach((service) => {
    if (!grouped[service.category]) {
      grouped[service.category] = [];
    }
    grouped[service.category].push(service);
  });

  return Object.entries(grouped).map(([categoryName, services]) => {
    const meta = categoryMeta[categoryName];

    return {
      title: meta?.name || categoryName,
      icon: meta?.icon || "/images/default-category-icon.png",
      services,
    };
  });
}
