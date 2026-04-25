"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export interface CartItem {
  serviceUid: string;
  serviceId: number;
  serviceName: string;
  quantity: number;
  link: string;
  dripFeed: boolean;
  intervalMinutes?: number;
  runs?: number;
  price: number;
  currency: string;
}

interface CartDrawerProps {
  cart: CartItem[];
  onCheckout: () => Promise<void>;
  submitting: boolean;
  error?: string | null;
  onUpdateQuantity?: (serviceUid: string, quantity: number) => void;
  onUpdateLink?: (serviceUid: string, link: string) => void;
  onUpdateDripFeed?: (
    serviceUid: string,
    dripFeed: boolean,
    runs?: number,
    interval?: number,
  ) => void;
  onRemoveFromCart?: (serviceUid: string) => void;
  serviceErrors?: Map<string, string[]>;
  userBalance?: number;
}

/**
 * Shared CartDrawer component for SMM ordering
 * Can be used across any page that needs cart functionality
 * Shows floating button with cart count and slide-out drawer overview
 */
export function CartDrawer({
  cart: externalCart,
  onCheckout,
  submitting,
  error,
  onUpdateQuantity,
  onUpdateLink,
  onUpdateDripFeed,
  onRemoveFromCart,
  serviceErrors,
  userBalance = 0,
}: CartDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cartTotal = externalCart.reduce((sum, item) => {
    const basePrice = Number(item.price) / 1000;
    const effectiveQty = item.dripFeed
      ? item.quantity * (item.runs || 1)
      : item.quantity;
    const converted = convert(
      item.currency as any,
      userCurrency,
      basePrice * effectiveQty,
      false,
      false,
    );
    return sum + Number(converted.amount || 0);
  }, 0);

  const hasInvalidLinks = externalCart.some(
    (item) => !item.link || !item.link.trim(),
  );
  const projectedBalance = userBalance - cartTotal;

  const handleCheckoutClick = async () => {
    if (hasInvalidLinks) {
      toast.error("All items require a link");
      return;
    }
    await onCheckout();
    if (!error) {
      setInternalOpen(false);
    }
  };

  if (!isClient) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <AnimatePresence>
        {externalCart.length > 0 && (
          <motion.button
            onClick={() => setInternalOpen(true)}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="px-4 h-12 flex items-center gap-2 font-semibold">
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              <Badge
                variant="secondary"
                className="ml-2 h-6 w-6 flex items-center justify-center p-0"
              >
                {externalCart.length}
              </Badge>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <Drawer open={internalOpen} onOpenChange={setInternalOpen}>
        <DrawerContent className="max-h-[90vh] flex flex-col bg-background">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Cart ({externalCart.length} items)
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {externalCart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground font-medium">
                  Your cart is empty
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add services to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {externalCart.map((item, idx) => (
                  <motion.div
                    key={item.serviceUid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex gap-3 items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {item.serviceName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {
                            convert(
                              item.currency as any,
                              userCurrency,
                              (Number(item.price) / 1000) *
                                (item.dripFeed
                                  ? item.quantity * (item.runs || 1)
                                  : item.quantity),
                              true,
                            ).formatted
                          }
                        </div>
                        {item.dripFeed && (
                          <div className="text-xs text-secondary mt-1 font-medium">
                            Drip: {item.runs} runs × {item.intervalMinutes}m
                          </div>
                        )}
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {item.dripFeed
                            ? `Qty per run ${item.quantity} x ${item.runs || 1} runs = ${item.quantity * (item.runs || 1)} total`
                            : `Single delivery: ${item.quantity} total quantity`}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-muted rounded-lg px-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            onUpdateQuantity?.(
                              item.serviceUid,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            onUpdateQuantity?.(
                              item.serviceUid,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1 text-destructive hover:text-destructive/80"
                          onClick={() => onRemoveFromCart?.(item.serviceUid)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Link input - editable for cross-page checkout */}
                    <div className="space-y-1 text-xs">
                      <Input
                        value={item.link}
                        onChange={(event) =>
                          onUpdateLink?.(item.serviceUid, event.target.value)
                        }
                        placeholder="Enter link"
                        className="h-8 text-xs"
                      />
                      {!item.link?.trim() && (
                        <div className="flex items-center gap-1 text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          Link required
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium">
                          Drip feed delivery
                        </p>
                        <Switch
                          checked={item.dripFeed}
                          onCheckedChange={(checked) =>
                            onUpdateDripFeed?.(
                              item.serviceUid,
                              checked,
                              item.runs || 1,
                              item.intervalMinutes || 60,
                            )
                          }
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Drip feed splits delivery into scheduled runs. Pricing
                        is based on total quantity across all runs.
                      </p>

                      {item.dripFeed && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="mb-1 text-[11px] text-muted-foreground">
                              Runs
                            </p>
                            <Input
                              type="number"
                              min={1}
                              value={item.runs || 1}
                              onChange={(event) => {
                                const runs = Math.max(
                                  1,
                                  Number.parseInt(
                                    event.target.value || "1",
                                    10,
                                  ),
                                );
                                onUpdateDripFeed?.(
                                  item.serviceUid,
                                  true,
                                  runs,
                                  item.intervalMinutes || 60,
                                );
                              }}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <p className="mb-1 text-[11px] text-muted-foreground">
                              Interval (min)
                            </p>
                            <Input
                              type="number"
                              min={1}
                              value={item.intervalMinutes || 60}
                              onChange={(event) => {
                                const interval = Math.max(
                                  1,
                                  Number.parseInt(
                                    event.target.value || "60",
                                    10,
                                  ),
                                );
                                onUpdateDripFeed?.(
                                  item.serviceUid,
                                  true,
                                  item.runs || 1,
                                  interval,
                                );
                              }}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Per-Service Errors */}
                    {serviceErrors?.has(item.serviceUid) && (
                      <div className="p-2 rounded bg-destructive/10 border border-destructive/30 space-y-1">
                        {serviceErrors.get(item.serviceUid)?.map((err, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 text-destructive text-xs"
                          >
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span>{err}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {externalCart.length > 0 && (
            <DrawerFooter className="border-t space-y-3">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    {cartTotal.toFixed(2)} {userCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{externalCart.length} service(s)</span>
                  <span>
                    {externalCart.reduce(
                      (sum, item) =>
                        sum + (item.dripFeed ? item.quantity * (item.runs || 1) : item.quantity),
                      0,
                    )}{" "}
                    total quantity
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/20 px-2 py-1.5 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Wallet className="h-3.5 w-3.5" />
                    Current balance
                  </span>
                  <span className="font-semibold text-foreground">
                    {userBalance.toFixed(2)} {userCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">After checkout</span>
                  <span
                    className={
                      projectedBalance < 0
                        ? "font-semibold text-destructive"
                        : "font-semibold text-foreground"
                    }
                  >
                    {projectedBalance.toFixed(2)} {userCurrency}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckoutClick}
                disabled={submitting || hasInvalidLinks}
                className="w-full"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  {submitting ? "Processing..." : "Proceed to Checkout"}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </span>
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
