"use client";

import {
  ordersConfig,
  ordersData,
  paymentsConfig,
  paymentsData,
} from "@/app/_docs/doc";
import { MetricsCards } from "../component/dashboard-metric-cards";
import RecentActivity from "../component/recent-activity";
import { DynamicStackedChart } from "./components/charts";
import { useGetUserDashboardStatistics } from "@/hooks/use-statistics";
import Loading from "@/app/loading";
import { BoxIcon, DollarSignIcon, ShoppingCartIcon, XIcon } from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

export default function Dashboard() {
  const { data, isLoading } = useGetUserDashboardStatistics();

  const { userCurrency } = useAppContext();

  const convert = useCurrencyConverter();

  if (isLoading) {
    return <Loading />;
  }

  const { formatted } = convert(
    "USD",
    userCurrency,
    data?.yourSpent!,
    true,
    true
  );

  const metrics = [
    {
      icon: <ShoppingCartIcon />,
      label: "Your Orders",
      value: data ? data.yourOrders : 0,
    },
    {
      icon: <XIcon />,
      label: "Failed Orders",
      value: data ? data.failedOrders : 0,
    },
    {
      icon: <BoxIcon />,
      label: "Store Orders",
      value: data ? data.storeOrders : 0,
    },
    {
      icon: <DollarSignIcon />,
      label: "You've Spent",
      value: data ? formatted : 0,
    },
  ];
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
          data={data ? data.ordersData : ordersData}
          config={ordersConfig}
          dataKeys={["completed", "orders"]}
          trendPercentage={93}
        />
        <DynamicStackedChart
          title="Payments Overview"
          description="Payment amounts in USD for the last 6 months"
          data={data ? data.paymentsData : paymentsData}
          config={paymentsConfig}
          dataKeys={["successful", "failed"]}
          trendPercentage={60}
        />
      </div>
      <RecentActivity services={data?.recentlyAddedServices} />
    </div>
  );
}
