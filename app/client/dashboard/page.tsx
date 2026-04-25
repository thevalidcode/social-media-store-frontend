"use client";

import { ordersConfig, paymentsConfig } from "@/app/_docs/doc";
import { MetricsCards } from "./components/metric-cards";
import RecentActivity from "./components/recent-activity";
import { DynamicStackedChart } from "./components/charts";
import { useGetUserDashboardStatistics } from "@/hooks/use-statistics";
import Loading from "@/app/loading";
import {
  BoxIcon,
  DollarSignIcon,
  Server,
  ShoppingCartIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { EmptyState } from "@/components/empty-state";
import { useGetCategories } from "@/hooks/use-category";
import { FeatureGate } from "@/components/FeatureGate";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { data, isLoading } = useGetUserDashboardStatistics();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();

  const { userCurrency, storeInfo, userInfo } = useAppContext();

  const convert = useCurrencyConverter();

  if (isLoading) {
    return <Loading />;
  }

  const { formatted } = convert(
    (userInfo?.currency || userCurrency) as any,
    userCurrency,
    data?.yourSpent!,
    true,
    false,
  );

  const walletFormatted = userInfo
    ? convert(
        userInfo.currency as any,
        userCurrency,
        userInfo.balance,
        true,
        false,
      ).formatted
    : "--";

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
  const analyticsAllowed = storeInfo?.features?.analytics ?? false;
  return (
    <div className="space-y-4 px-3">
      <FeatureGate
        isAllowed={analyticsAllowed}
        featureLabel="Analytics"
        description="Analytics features are not available for your store. Please contact support for more information."
        variant="page"
      >
        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Overview of orders, payments, and wallet activity for your store.
            </p>
          </div>
          <Card className="border-border/70 bg-card/80 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Wallet balance
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {walletFormatted}
                </div>
              </div>
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <WalletIcon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>
        <MetricsCards
          metrics={metrics.map((m) => ({
            title: m.label,
            icon: m.icon,
            value: m.value,
          }))}
        />
        {/* charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicStackedChart
            title="Orders Overview"
            description="Showing total orders for the last 6 months."
            data={data ? data.ordersData : []}
            config={ordersConfig}
            dataKeys={["completed", "orders"]}
            trendPercentage={93}
          />
          <DynamicStackedChart
            title="Payments Overview"
            description="Payment amounts in USD for the last 6 months"
            data={data ? data.paymentsData : []}
            config={paymentsConfig}
            dataKeys={["successful", "failed"]}
            trendPercentage={60}
          />
        </div>
        {data &&
        data.recentlyAddedServices &&
        data.recentlyAddedServices.length === 0 ? (
          <EmptyState
            icon={Server}
            title="No Service Found"
            description="No service has been created yet."
          />
        ) : (
          <RecentActivity
            services={data?.recentlyAddedServices}
            categories={categories || []}
          />
        )}
      </FeatureGate>
    </div>
  );
}
