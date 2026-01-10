"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Service } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import Image from "next/image";

interface Props {
  services: Service[];
  openModal: (s: Service) => void;
  navigateToNewOrder: (cat: string, id: number) => void;
}

export const ServicesTableDesktop = ({
  services,
  openModal,
  navigateToNewOrder,
}: Props) => {
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();
  return (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
      <Table className="w-full lg:min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead className="w-44">Price Per 1000</TableHead>
            <TableHead className="w-36">Min - Max</TableHead>
            <TableHead className="w-36">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {services.map((s) => (
            <TableRow
              key={s.storeScopedId}
              className="hover:bg-muted/40 transition-colors"
            >
              <TableCell className="font-mono text-sm">
                {s.storeScopedId}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {s.icon ? (
                      <Image
                        src={s.icon}
                        alt={s.name}
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
                      {s.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px] lg:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[700px]">
                      {s.category}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {
                    convert(s.currency, userCurrency, s.price, true, false)
                      .formatted
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  per 1000 units
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {s.min} - {s.max}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
