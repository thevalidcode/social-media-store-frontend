import type React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReferralCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  className?: string;
  valueFormatter?: (value: number) => string;
}

export default function ReferralCard({
  icon,
  title,
  value,
  className,
  valueFormatter = (val) => val.toString(),
}: ReferralCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md border-border/50",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground leading-none">
              {title}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold tracking-tight">
          {valueFormatter(value)}
        </div>
      </CardContent>
    </Card>
  );
}
