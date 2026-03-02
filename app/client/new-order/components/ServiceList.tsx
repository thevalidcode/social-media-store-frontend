import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service, ServiceCategory } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { ServiceDialog } from "../../services/components/ServiceDialog";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  services: Service[];
  category: ServiceCategory;
  cartItems: {
    serviceId: number;
    serviceUid: string;
    quantity: number;
    link: string;
  }[];
  addToCart: (s: Service, qty?: number, link?: string) => void;
  updateQuantity: (serviceUid: string, qty: number) => void;
  updateLink: (serviceUid: string, link: string) => void;
}

export const ServiceList: React.FC<Props> = ({
  services,
  cartItems,
  addToCart,
  updateQuantity,
  updateLink,
}) => {
  const router = useRouter();
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalQty, setModalQty] = useState(1);
  const { userCurrency } = useAppContext();

  const navigateToNewOrder = (
    categoryIdentifier: string,
    serviceId: number
  ) => {
    const params = new URLSearchParams();
    params.set("category", categoryIdentifier);
    params.set("service", String(serviceId));
    params.set("quantity", String(modalQty));
    setActiveService(null);
    setDialogOpen(false);
    router.push(`/client/new-order?${params.toString()}`);
  };

  const handleOpenDialog = (service: Service) => {
    setActiveService(service);
    setDialogOpen(true);
  };
  const convert = useCurrencyConverter();

  return (
    <div>
      <LabelAndTitle title="Available Services" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {services.map((s) => {
          const inCart = cartItems.find((c) => c.serviceUid === s.uid) ?? {
            quantity: 0,
            link: "",
          };

          const perUnit = perUnitPrice(s.price);
          const effectiveQty = inCart.quantity;
          const subtotal = perUnit * effectiveQty;

          return (
            <Card
              key={s.storeScopedId}
              className="rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <CardHeader className="flex flex-row items-center gap-3 p-3">
                {s.icon ? (
                  <Image
                    src={s.icon}
                    alt={s.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground text-5xl">🧩</div>
                )}
                <div className="flex-1 min-w-0">
                  <CardTitle className="truncate text-sm font-semibold">
                    {s.name}
                  </CardTitle>
                  <div className="text-xs mt-1 text-muted-foreground">
                    {
                      convert(s.currency, userCurrency, s.price, true, false)
                        .formatted
                    }{" "}
                    / 1000 •{" "}
                    {
                      convert(s.currency, userCurrency, perUnit, true, false)
                        .formatted
                    }{" "}
                    per unit
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-3 flex flex-col flex-1 justify-between gap-3">
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => handleOpenDialog(s)}
                  >
                    Description
                  </Button>
                  <div className="text-[11px] text-muted-foreground text-right">
                    Subtotal:{" "}
                    <span className="font-medium text-foreground">
                      {
                        convert(s.currency, userCurrency, subtotal, true, false)
                          .formatted
                      }
                    </span>
                  </div>
                </div>

                <Input
                  placeholder="Enter link (required)"
                  value={inCart.link}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateLink(s.uid, e.target.value)
                  }
                  className="text-sm h-8"
                />

                <div className="flex items-center gap-2 justify-between flex-wrap">
                  <div className="flex items-center gap-2 flex-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 flex-1"
                      onClick={() =>
                        updateQuantity(s.uid, Math.max(0, inCart.quantity - 1))
                      }
                    >
                      -
                    </Button>
                    <Input
                      className="w-16 text-center h-8 text-sm flex-2"
                      type="number"
                      min={0}
                      value={inCart.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateQuantity(
                          s.uid,
                          parseInt(e.target.value || "0", 10)
                        )
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 flex-1"
                      onClick={() => addToCart(s, 1, inCart.link)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs flex-1"
                    disabled={!inCart.link}
                    onClick={() => addToCart(s, 1, inCart.link)}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ServiceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        activeService={activeService}
        modalQty={modalQty}
        setModalQty={setModalQty}
        navigateToNewOrder={navigateToNewOrder}
      />
    </div>
  );
};

const LabelAndTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="mt-6 mb-2">
    <h2 className="text-sm font-medium tracking-tight text-muted-foreground">
      {title}
    </h2>
  </div>
);

function perUnitPrice(price: string): number {
  return parseInt(price) / 1000;
}
