import type React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ReferralCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  className?: string;
}

export default function GridCard({
  icon,
  title,
  value,
  className,
}: ReferralCardProps) {
  return (
    <Card className={`${className} shadow-none`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-wider">{title}</p>
            <p className="text-2xl  font-semibold">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
