"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import Decimal from "decimal.js";

interface Props {
  open: boolean;
  onClose: () => void;
  activeService: Service | null;
  modalQty: number;
  setModalQty: React.Dispatch<React.SetStateAction<number>>;
  navigateToNewOrder: (cat: string, id: number) => void;
}

export const ServiceDialog = ({
  open,
  onClose,
  activeService,
  modalQty,
  setModalQty,
  navigateToNewOrder,
}: Props) => {
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{activeService?.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {activeService?.description}
          </DialogDescription>
        </DialogHeader>

        {activeService && (
          <div className="px-6 py-4 space-y-5">
            <div className="md:col-span-1">
              {activeService.icon ? (
                <img
                  src={activeService.icon}
                  alt={activeService.name}
                  className="w-full h-44 object-cover rounded-lg"
                />
              ) : (
                <div className="text-muted-foreground text-[176px]">🧩</div>
              )}
              <div className="mt-3 text-sm text-muted-foreground">
                Per 1000:{" "}
                {
                  convert(
                    activeService.currency,
                    userCurrency,
                    activeService.price,
                    true,
                    true
                  ).formatted
                }
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Min: {activeService.min} — Max: {activeService.max}
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col">
              <Label htmlFor="modal-qty">Quantity</Label>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setModalQty((q) =>
                      Math.max(activeService?.min ?? 1, Math.max(1, q - 1))
                    )
                  }
                >
                  -
                </Button>
                <Input
                  id="modal-qty"
                  type="number"
                  min={activeService.min}
                  max={activeService.max}
                  value={modalQty}
                  onChange={(e) =>
                    setModalQty(parseInt(e.target.value || "0", 10) || 0)
                  }
                  className="w-32 text-center"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setModalQty((q) =>
                      Math.min(
                        activeService?.max ?? Number.MAX_SAFE_INTEGER,
                        q + 1
                      )
                    )
                  }
                >
                  +
                </Button>
                <div className="ml-auto text-right">
                  <div className="text-sm text-muted-foreground">Estimated</div>
                  <div className="font-semibold">
                    {
                      convert(
                        activeService.currency,
                        userCurrency,
                        new Decimal(activeService.price)
                          .div(1000)
                          .mul(modalQty)
                          .toString(),
                        true,
                        false
                      ).formatted
                    }
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    navigateToNewOrder(
                      activeService.category ?? activeService.category,
                      activeService.storeScopedId
                    )
                  }
                >
                  Order Now
                </Button>
              </DialogFooter>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
