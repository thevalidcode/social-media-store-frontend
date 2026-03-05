"use client";

import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FloatingCartProps {
  itemCount: number;
  onClick: () => void;
  isVisible: boolean;
}

export function FloatingCart({
  itemCount,
  onClick,
  isVisible,
}: FloatingCartProps) {
  if (!isVisible || itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl h-14 w-14 rounded-full p-0 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4",
        )}
      >
        <div className="relative">
          <ShoppingCartIcon className="size-6" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </div>
      </Button>
    </div>
  );
}
