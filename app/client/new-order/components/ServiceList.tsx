"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus } from "lucide-react";

import type { Service, ServiceCategory } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ServiceDialog } from "../../services/components/ServiceDialog";

interface Props {
  services: Service[];
  category: ServiceCategory;
  cartItems: {
    serviceId: number;
    serviceUid: string;
    quantity: number;
    link: string;
    dripFeed: boolean;
    intervalMinutes: number;
    runs: number;
  }[];
  addToCart: (service: Service, qty?: number, link?: string) => void;
  updateQuantity: (serviceUid: string, qty: number, service?: Service) => void;
  updateLink: (serviceUid: string, link: string, service?: Service) => void;
  updateDripFeed: (
    serviceUid: string,
    dripFeed: boolean,
    runs?: number,
    interval?: number,
  ) => void;
}

export const ServiceList: React.FC<Props> = ({
  services,
  cartItems,
  updateQuantity,
  updateLink,
  updateDripFeed,
}) => {
  const router = useRouter();
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalQty, setModalQty] = useState(1);

  const navigateToNewOrder = (
    categoryIdentifier: string,
    serviceId: number,
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

  const getPricePerUnit = (price: string) => Number.parseFloat(price) / 1000;

  return (
    <div>
      <LabelAndTitle title="Available Services" />

      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const existingCartItem = cartItems.find(
            (item) => item.serviceUid === service.uid,
          );
          const inCart = existingCartItem || {
            quantity: 0,
            link: "",
            dripFeed: false,
            intervalMinutes: 60,
            runs: 1,
          };

          const perUnit = getPricePerUnit(service.price);
          const effectiveQty = inCart.dripFeed
            ? inCart.quantity * (inCart.runs || 1)
            : inCart.quantity;
          const subtotal = perUnit * effectiveQty;

          return (
            <Card
              key={service.storeScopedId}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="border-b border-border/60 p-4 pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
                    {service.icon ? (
                      <Image
                        src={service.icon}
                        alt={service.name}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-lg text-muted-foreground">🧩</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 break-words text-sm font-semibold md:text-base">
                        {service.name}
                      </CardTitle>
                      {service.refill && (
                        <Badge variant="secondary" className="shrink-0">
                          Refill
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-2 break-words text-xs text-muted-foreground">
                      {service.category}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                  <div className="min-w-0 rounded-xl bg-muted/40 p-2">
                    <p className="text-muted-foreground">Price / 1000</p>
                    <p className="mt-1 truncate font-medium">
                      {
                        convert(
                          service.currency,
                          userCurrency,
                          service.price,
                          true,
                          false,
                        ).formatted
                      }
                    </p>
                  </div>
                  <div className="min-w-0 rounded-xl bg-muted/40 p-2">
                    <p className="text-muted-foreground">Per unit</p>
                    <p className="mt-1 truncate font-medium">
                      {
                        convert(
                          service.currency,
                          userCurrency,
                          perUnit,
                          true,
                          false,
                        ).formatted
                      }
                    </p>
                  </div>
                  <div className="min-w-0 rounded-xl bg-muted/40 p-2">
                    <p className="text-muted-foreground">Limits</p>
                    <p className="mt-1 truncate font-medium">
                      {service.min.toLocaleString()} -{" "}
                      {service.max.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 p-4 pt-3">
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-0 text-xs"
                    onClick={() => handleOpenDialog(service)}
                  >
                    View service
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                  <div className="text-right">
                    <span className="block">Subtotal</span>
                    <span className="font-medium text-foreground">
                      {
                        convert(
                          service.currency,
                          userCurrency,
                          subtotal,
                          true,
                          false,
                        ).formatted
                      }
                    </span>
                  </div>
                </div>

                <Input
                  placeholder="Enter link"
                  value={inCart.link}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newLink = event.target.value;
                    updateLink(service.uid, newLink, service);
                    if (newLink.trim() && inCart.quantity === 0) {
                      updateQuantity(service.uid, 1, service);
                    }
                  }}
                  className="h-10 text-sm"
                />

                <div className="grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/20 p-1.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-xl"
                      onClick={() =>
                        updateQuantity(
                          service.uid,
                          Math.max(0, inCart.quantity - 1),
                          service,
                        )
                      }
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <Input
                      className="h-8 w-16 border-0 bg-transparent text-center text-sm shadow-none focus-visible:ring-0"
                      type="number"
                      min={0}
                      value={inCart.quantity}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        updateQuantity(
                          service.uid,
                          Number.parseInt(event.target.value || "0", 10),
                          service,
                        )
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-xl"
                      onClick={() => {
                        const nextQty = (inCart.quantity || 0) + 1;
                        updateQuantity(service.uid, nextQty, service);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    className="h-10 px-4"
                    disabled={!inCart.link}
                    onClick={() => {
                      const safeQty = inCart.quantity > 0 ? inCart.quantity : 1;
                      updateQuantity(service.uid, safeQty, service);
                      updateLink(service.uid, inCart.link, service);
                    }}
                  >
                    Save
                  </Button>
                </div>

                {service.dripFeed && inCart.quantity > 0 && (
                  <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Drip feed
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Split delivery into multiple runs to reduce sudden
                          drops.
                        </p>
                      </div>
                      <Switch
                        checked={Boolean(inCart.dripFeed)}
                        onCheckedChange={(checked) =>
                          updateDripFeed(
                            service.uid,
                            checked,
                            inCart.runs || 1,
                            inCart.intervalMinutes || 60,
                          )
                        }
                      />
                    </div>

                    {inCart.dripFeed && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="mb-1 text-[11px] text-muted-foreground">
                            Runs
                          </p>
                          <Input
                            type="number"
                            min={1}
                            value={inCart.runs || 1}
                            onChange={(event) => {
                              const runs = Math.max(
                                1,
                                Number.parseInt(event.target.value || "1", 10),
                              );
                              updateDripFeed(
                                service.uid,
                                true,
                                runs,
                                inCart.intervalMinutes || 60,
                              );
                            }}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <p className="mb-1 text-[11px] text-muted-foreground">
                            Interval (minutes)
                          </p>
                          <Input
                            type="number"
                            min={1}
                            value={inCart.intervalMinutes || 60}
                            onChange={(event) => {
                              const interval = Math.max(
                                1,
                                Number.parseInt(event.target.value || "60", 10),
                              );
                              updateDripFeed(
                                service.uid,
                                true,
                                inCart.runs || 1,
                                interval,
                              );
                            }}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-2 rounded-xl bg-background p-2 text-[11px] text-muted-foreground">
                      {inCart.dripFeed ? (
                        <>
                          Qty per run: {inCart.quantity} x {inCart.runs || 1}{" "}
                          runs ={" "}
                          <span className="font-medium text-foreground">
                            {effectiveQty.toLocaleString()}
                          </span>{" "}
                          total quantity
                        </>
                      ) : (
                        <>
                          Single delivery mode: total quantity is{" "}
                          {inCart.quantity.toLocaleString()}.
                        </>
                      )}
                    </div>
                  </div>
                )}
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
  <div className="mb-2 mt-2">
    <h2 className="text-sm font-medium tracking-tight text-muted-foreground">
      {title}
    </h2>
  </div>
);
