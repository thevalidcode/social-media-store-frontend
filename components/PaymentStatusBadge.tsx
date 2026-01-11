import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { PaymentStatus } from "@/types";

export default function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const statusConfig = {
    SUCCESS: {
      variant: "default" as const,
      icon: CheckCircle2,
      label: "Success",
    },
    PENDING: {
      variant: "secondary" as const,
      icon: Clock,
      label: "Pending",
    },
    FAILED: {
      variant: "destructive" as const,
      icon: XCircle,
      label: "Failed",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
