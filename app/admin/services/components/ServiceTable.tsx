"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Service, ServiceStatus } from "@/types";
import Image from "next/image";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDeleteSingle: (id: number) => void;
  onToggleStatus: (serviceId: number, newStatus: ServiceStatus) => void;
}

export default function ServiceTable({
  services,
  onEdit,
  onDeleteSingle,
  onToggleStatus,
}: ServiceTableProps) {
  const [sortKey, setSortKey] = useState<keyof Service>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  const handleSort = (key: keyof Service) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedServices = [...services].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === "string" && typeof valB === "string")
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    if (typeof valA === "number" && typeof valB === "number")
      return sortAsc ? valA - valB : valB - valA;
    return 0;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table className="w-full lg:min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-1">
                Name & Category <ArrowUpDown className="w-3 h-3" />
              </div>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("price")}
            >
              <div className="flex items-center gap-1">
                Price <ArrowUpDown className="w-3 h-3" />
              </div>
            </TableHead>
            <TableHead>Min</TableHead>
            <TableHead>Max</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-1">
                Status <ArrowUpDown className="w-3 h-3" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {sortedServices.map((service) => (
              <motion.tr
                key={service.storeScopedId}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-border"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      {service.icon ? (
                        <Image
                          src={service.icon}
                          alt={service.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-xs">🧩</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate max-w-[200px] lg:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[700px]">
                        {service.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px] lg:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[700px]">
                        {service.category}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{service.type}</TableCell>
                <TableCell>
                  {
                    convert(
                      service.currency || "USD",
                      userCurrency,
                      service.price,
                      true,
                      false
                    ).formatted
                  }
                </TableCell>
                <TableCell>{service.min}</TableCell>
                <TableCell>{service.max}</TableCell>
                <TableCell>
                  <Switch
                    checked={service.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      onToggleStatus(
                        service.storeScopedId,
                        checked ? "ACTIVE" : "DISABLED"
                      )
                    }
                  />
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit(service)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    type="button"
                    variant="destructive"
                    onClick={() => onDeleteSingle(service.storeScopedId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
