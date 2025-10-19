"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ReferralCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  valueFormatter?: (val: number) => string;
  className?: string;
}

export default function GridCard({
  icon,
  title,
  value,
  valueFormatter,
  className,
}: ReferralCardProps) {
  const displayValue = valueFormatter ? valueFormatter(value) : value;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
    >
      <Card
        className={`border border-border bg-card rounded-xl hover:shadow-md transition-shadow duration-200 ${className}`}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground tracking-wider uppercase">
                {title}
              </p>
              <p className="text-2xl font-semibold mt-1">{displayValue}</p>
            </div>
            <div className="flex items-center justify-center bg-muted/40 rounded-lg p-2">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
