"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const ComingSoon = ({
  title = "Coming Soon",
  description = "We’re working on something amazing. Stay tuned!",
  actionLabel,
  onAction,
  className,
}: ComingSoonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex justify-center items-center py-24", className)}
    >
      <Card className="w-full max-w-md text-center border-dashed shadow-sm">
        <CardContent className="flex flex-col items-center justify-center space-y-5 py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-full bg-primary/10 text-primary"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>

          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>

          <p className="text-sm text-muted-foreground max-w-sm">
            {description}
          </p>

          {actionLabel && onAction && (
            <Button onClick={onAction} className="mt-2">
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
