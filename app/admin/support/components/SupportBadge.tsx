"use client";

import { Badge } from "@/components/ui/badge";

export default function SupportBadge({ status }: { status: string }) {
  const variants = {
    open: "destructive",
    "in-progress": "default",
    resolved: "secondary",
    closed: "outline",
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] || "outline"}>
      {status}
    </Badge>
  );
}
