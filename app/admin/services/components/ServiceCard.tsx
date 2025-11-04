"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Service } from "@/types";
import Image from "next/image";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

interface ServiceCardProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDeleteSingle: (id: number) => void;
  onToggleStatus: (serviceId: number, newStatus: "active" | "disabled") => void;
}

export default function ServiceCard({
  services,
  onEdit,
  onDeleteSingle,
  onToggleStatus,
}: ServiceCardProps) {
  const convert = useCurrencyConverter();
  const { userCurrency, storeId } = useAppContext();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {services.map((service) => {
        const {
          storeScopedId,
          name,
          category,
          type,
          price,
          min,
          max,
          status,
          icon,
          currency,
        } = service;

        return (
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            <Card className="rounded-2xl border border-border/60 shadow-sm bg-card hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                      {icon ? (
                        <Image
                          src={icon}
                          alt={name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-sm">🧩</div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-base">{name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {category}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      onToggleStatus(
                        storeScopedId,
                        checked ? "active" : "disabled"
                      )
                    }
                  />
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="block text-muted-foreground text-xs">
                    Type
                  </span>
                  <span className="font-medium">{type}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs">
                    Price
                  </span>
                  <span className="font-medium">
                    {" "}
                    {
                      convert(currency, userCurrency, price, true, true)
                        .formatted
                    }
                  </span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs">
                    Min
                  </span>
                  <span className="font-medium">{min}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs">
                    Max
                  </span>
                  <span className="font-medium">{max}</span>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-xl hover:bg-muted/60"
                  onClick={() => onEdit(service)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="rounded-xl"
                  onClick={() => onDeleteSingle(service.storeScopedId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
