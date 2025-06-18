import { metrics } from "@/app/_docs/doc";
import { MetricsCards } from "../component/dashboard-metric-cards";
import RecentActivity from "../component/recent-activity";
import { ChartAreaStacked } from "../component/order-trends";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <MetricsCards
        metrics={metrics.map((m) => ({
          title: m.label,
          icon: m.icon,
          value:
            typeof m.value === "string"
              ? Number(m.value.replace(/[^0-9.-]+/g, "")) || 0
              : m.value,
        }))}
      />
      {/* charts */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        <ChartAreaStacked />
        <ChartAreaStacked />
      </div>
      <RecentActivity />
    </div>
  );
}
