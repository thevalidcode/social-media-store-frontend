"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon, Inbox } from "lucide-react";
import { FeatureGate } from "./FeatureGate";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  canAddMore?: boolean;
  maxAmount?: number;
  featureLabel?: string;
  tooltipDescription?: string;
}

export const EmptyState = ({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "You haven’t created anything yet.",
  actionLabel,
  onAction,
  canAddMore,
  className,
  maxAmount,
  featureLabel = "Limit reached",
  tooltipDescription,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full flex justify-center items-center py-20", className)}
    >
      <Card className="w-full max-w-md text-center border-dashed">
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-10">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <Icon className="w-8 h-8" />
          </div>

          <h2 className="text-lg font-semibold text-foreground">{title}</h2>

          <p className="text-sm text-muted-foreground max-w-sm">
            {description}
          </p>

          {actionLabel && onAction && (
            canAddMore === false ? (
              <FeatureGate
                isAllowed={false}
                featureLabel={featureLabel}
                variant="tooltip"
                description={
                  tooltipDescription ||
                  (maxAmount
                    ? `You've reached the maximum of ${maxAmount} items. Upgrade to add more.`
                    : "Upgrade your plan to unlock this action.")
                }
              >
                <Button disabled className="mt-4 cursor-not-allowed opacity-70">
                  {actionLabel}
                </Button>
              </FeatureGate>
            ) : (
              <Button onClick={onAction} className="mt-4">
                {actionLabel}
              </Button>
            )
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
