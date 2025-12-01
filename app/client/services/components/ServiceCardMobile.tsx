"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Service } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

interface Props {
  services: Service[];
  openModal: (s: Service) => void;
  navigateToNewOrder: (cat: string, id: number) => void;
}

export const ServicesCardsMobile = ({
  services,
  openModal,
  navigateToNewOrder,
}: Props) => {
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();
  return (
    <div className="md:hidden space-y-4">
      {services.map((s, idx) => (
        <motion.div
          key={s.storeScopedId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: idx * 0.03 }}
          className="bg-card border border-border rounded-xl shadow-sm p-4"
        >
          <div className="flex gap-4">
            <img
              src={
                s.icon ??
                `https://picsum.photos/seed/service-${s.storeScopedId}/120`
              }
              alt={s.name}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold truncate">{s.name}</div>
                <div className="text-sm font-mono">{s.storeScopedId}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {s.category}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="text-sm">
                  {
                    convert(s.currency, userCurrency, s.price, true, false)
                      .formatted
                  }
                </div>
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal(s)}
                  >
                    Description
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigateToNewOrder(
                        s.category ?? s.category,
                        s.storeScopedId
                      )
                    }
                  >
                    Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
