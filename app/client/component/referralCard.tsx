import type React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ReferralCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  className?: string;
  valueFormatter?: (value: number) => string;
}

export default function GridCard({
  icon,
  title,
  value,
  className,
  valueFormatter = (val) => val.toString(),
}: ReferralCardProps) {
  return (
    <Card>
      <CardContent className={`p-4 flex items-center${className}`}>
        <div className="bg-blue-50 p-3 rounded-full mr-4">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{valueFormatter(value)}</h3>
          <p className="text-xs text-green-600">{valueFormatter(value)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
