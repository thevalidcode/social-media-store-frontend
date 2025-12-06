import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import Image from "next/image";

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
  runs: number;
}

export const CartMobile: React.FC<Props> = ({
  cart,
  services,
  dripEnabled,
  runs,
}) => {
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  const perUnitPrice = (price: number) => price / 1000;
  return (
    <div className="lg:hidden">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <div className="text-sm">Cart is empty</div>
          ) : (
            <div className="space-y-4">
              {cart.map((c) => {
                const svc = services.find(
                  (s) => s.storeScopedId === c.serviceId
                )!;
                const effQty = dripEnabled ? c.quantity * runs : c.quantity;
                const perUnit = convert(
                  svc.currency,
                  userCurrency,
                  perUnitPrice(c.price) * effQty,
                  true,
                  true
                ).formatted;
                return (
                  <div key={c.serviceId} className="flex items-center gap-4">
                    {svc.icon ? (
                      <Image
                        src={svc.icon}
                        alt={svc.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground text-5xl">🧩</div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs">
                        {c.quantity} x {dripEnabled ? runs : 1} runs = {effQty}{" "}
                        units
                      </div>
                    </div>
                    <div className="font-semibold">{perUnit}</div>
                  </div>
                );
              })}

              <div className="flex justify-between mt-4">
                <div className="font-medium">Total</div>
                <div className="font-bold">
                  {
                    convert(
                      "USD",
                      userCurrency,
                      cart.reduce((acc, c) => {
                        const effQty = dripEnabled
                          ? c.quantity * runs
                          : c.quantity;
                        return acc + perUnitPrice(c.price) * effQty;
                      }, 0),
                      true,
                      true
                    ).formatted
                  }
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
