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
    <div className="hidden md:block">
      <Table className="rounded-lg border border-border bg-card overflow-hidden">
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
                  <div className="min-w-0">
                    <div className="font-medium truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {s.category}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {
                    convert(
                      s.currency,
                      userCurrency,
                      s.price,
                      true,
                      false
                    ).formatted
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
