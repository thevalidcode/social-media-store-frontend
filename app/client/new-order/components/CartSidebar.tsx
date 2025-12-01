import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

interface CartItemLocal {
  serviceId: number;
  name: string;
  price: number;
  quantity: number;
  link: string;
}

interface Props {
  cart: CartItemLocal[];
  services: Service[];
  dripEnabled: boolean;
  setDripEnabled: (v: boolean) => void;
  intervalMinutes: number;
  setIntervalMinutes: (n: number) => void;
  runs: number;
  setRuns: (n: number) => void;
  grandTotal: number;
  updateQuantity: (serviceId: number, qty: number) => void;
  updateLink: (serviceId: number, link: string) => void;
  removeFromCart: (serviceId: number) => void;
  handleSubmit: () => Promise<void>;
  errors: string | null;
  submitting: boolean;
  schedulePreview: string[];
}

export const CartSidebar: React.FC<Props> = ({
  cart,
  services,
  dripEnabled,
  setDripEnabled,
  intervalMinutes,
  setIntervalMinutes,
  runs,
  setRuns,
  grandTotal,
  updateQuantity,
  updateLink,
  removeFromCart,
  handleSubmit,
  errors,
  submitting,
  schedulePreview,
}) => {
  const perUnitPrice = (price: number) => price / 1000;

  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-xl">Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <div className="text-sm">Cart is empty</div>
        ) : (
          <ul className="space-y-4">
            {cart.map((c) => {
              const svc = services.find((s) => s.id === c.serviceId)!;
              const perUnit = perUnitPrice(c.price);
              const effQty = dripEnabled ? c.quantity * runs : c.quantity;
              return (
                <li key={c.serviceId} className="flex gap-3 items-start">
                  <img
                    src={svc.icon}
                    alt={svc.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs">
                          Per 1000:{" "}
                          {
                            convert(
                              svc.currency,
                              userCurrency,
                              c.price,
                              true,
                              true
                            ).formatted
                          }
                        </div>
                        <div className="text-xs">
                          Per unit: $
                          {
                            convert(
                              svc.currency,
                              userCurrency,
                              perUnit,
                              true,
                              true
                            ).formatted
                          }
                        </div>
                      </div>
                      <div className="font-semibold">
                        {
                          convert(
                            svc.currency,
                            userCurrency,
                            perUnit * effQty,
                            true,
                            true
                          ).formatted
                        }
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-2">
                      <Input
                        placeholder="Enter link"
                        value={c.link}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateLink(c.serviceId, e.target.value)
                        }
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(
                              c.serviceId,
                              Math.max(0, c.quantity - 1)
                            )
                          }
                        >
                          -
                        </Button>
                        <Input
                          className="w-20 text-center"
                          type="number"
                          value={c.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              c.serviceId,
                              parseInt(e.target.value || "0", 10)
                            )
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(c.serviceId, c.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(c.serviceId)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Grand Total</div>
            <div className="text-2xl font-bold">
              {convert("USD", userCurrency, grandTotal, true, false).formatted}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <Label>Drip feed</Label>
              <p className="text-xs">Spread runs over time</p>
            </div>
            <Switch
              checked={dripEnabled}
              onCheckedChange={(v: boolean) => setDripEnabled(Boolean(v))}
            />
          </div>

          {dripEnabled && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="interval">Interval (minutes)</Label>
                  <Input
                    id="interval"
                    type="number"
                    min={1}
                    value={intervalMinutes}
                    onChange={(e) =>
                      setIntervalMinutes(parseInt(e.target.value || "0", 10))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="runs">Runs</Label>
                  <Input
                    id="runs"
                    type="number"
                    min={1}
                    value={runs}
                    onChange={(e) =>
                      setRuns(parseInt(e.target.value || "1", 10))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Next runs preview</Label>
                <ol className="list-decimal ml-6 mt-2 space-y-1 text-sm">
                  {schedulePreview.length === 0 ? (
                    <li>No preview</li>
                  ) : (
                    schedulePreview.map((t, idx) => <li key={idx}>{t}</li>)
                  )}
                </ol>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        {errors && <div className="text-red-600">{errors}</div>}
        <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Order"}
        </Button>
      </CardFooter>
    </Card>
  );
};
