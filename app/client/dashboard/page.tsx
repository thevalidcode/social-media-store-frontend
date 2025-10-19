import {
  metrics,
  ordersConfig,
  ordersData,
  paymentsConfig,
  paymentsData,
} from "@/app/_docs/doc";
import { MetricsCards } from "../component/dashboard-metric-cards";
import RecentActivity from "../component/recent-activity";
import { DynamicStackedChart } from "./components/charts";
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DynamicStackedChart
          title="Orders Overview"
          description="Showing total orders for the last 6 months."
          data={ordersData}
          config={ordersConfig}
          dataKeys={["completed", "orders"]}
          trendPercentage={93}
        />
        <DynamicStackedChart
          title="Payments Overview"
          description="Payment amounts in USD for the last 6 months"
          data={paymentsData}
          config={paymentsConfig}
          dataKeys={["successful", "failed"]}
          trendPercentage={60}
        />
      </div>
      <RecentActivity />
    </div>
  );
}
