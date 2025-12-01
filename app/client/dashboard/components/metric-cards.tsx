import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function MetricsCards({ metrics }: { metrics: MetricProps[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary flex items-center justify-center">
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight">
                {metric.value}
              </div>
              {metric.trend && (
                <div
                  className={cn(
                    "flex items-center text-sm",
                    metric.trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {metric.trend.isPositive ? "↑" : "↓"}{" "}
                  {Math.abs(metric.trend.value)}%
                </div>
              )}
            </div>
            {metric.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
