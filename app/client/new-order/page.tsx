"use client";

import React, { useEffect, useMemo, useState } from "react";
import { addMinutes, format } from "date-fns";

// shadcn/ui components (adjust imports to your project structure if needed)
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";

// -------------------- Types --------------------
interface Category {
  id: string;
  name: string;
  img: string;
}

interface Service {
  id: string;
  categoryId: string;
  name: string;
  price: number; // price for 1000 units
  img: string;
}

interface CartItem {
  serviceId: string;
  name: string;
  price: number;
  quantity: number; // per-run quantity
  link: string;
}

interface DripFeedPayload {
  enabled: boolean;
  intervalMinutes: number;
  runs: number;
}

interface OrderPayload {
  categoryId: string;
  items: { serviceId: string; quantity: number; unitPrice: number }[];
  dripFeed: DripFeedPayload;
  totalPrice: number;
}

// -------------------- Mock data (prices are for 1000 units) --------------------
const categories: Category[] = [
  {
    id: "cat-social",
    name: "Social Media",
    img: "https://images.unsplash.com/photo-1520975919757-6a7a1f0b8f62?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
  },
  {
    id: "cat-ads",
    name: "Advertising",
    img: "https://images.unsplash.com/photo-1508385082359-f3f7a34f4b1b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
  },
  {
    id: "cat-design",
    name: "Design",
    img: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
  },
];

const services: Service[] = [
  {
    id: "svc-1",
    categoryId: "cat-social",
    name: "Instagram Likes",
    price: 50,
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
  },
  {
    id: "svc-2",
    categoryId: "cat-social",
    name: "YouTube Views",
    price: 20,
    img: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
  },
  {
    id: "svc-3",
    categoryId: "cat-ads",
    name: "Facebook Ad Setup",
    price: 50000,
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
  },
  {
    id: "svc-4",
    categoryId: "cat-design",
    name: "Logo Design",
    price: 120000,
    img: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
  },
  {
    id: "svc-5",
    categoryId: "cat-design",
    name: "Thumbnail Pack",
    price: 25000,
    img: "https://images.unsplash.com/photo-1524544750200-df4b04b3d3e6?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
  },
];

// -------------------- Helpers --------------------
const formatCurrency = (n: number): string => {
  if (n >= 1000) return "$" + (n / 1000).toLocaleString() + "k";
  return "$" + n.toFixed(2);
};

const perUnitPrice = (price: number): number => price / 1000;

export default function NewOrderPage() {
  const [categoryId, setCategoryId] = useState<string>(categories[0].id);
  const [filteredServices, setFilteredServices] = useState<Service[]>(() =>
    services.filter((s) => s.categoryId === categories[0].id)
  );

  const [cart, setCart] = useState<CartItem[]>([]);
  const [dripEnabled, setDripEnabled] = useState<boolean>(false);
  const [intervalMinutes, setIntervalMinutes] = useState<number>(60);
  const [runs, setRuns] = useState<number>(1);
  const [errors, setErrors] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setFilteredServices(services.filter((s) => s.categoryId === categoryId));
  }, [categoryId]);

  const addToCart = (service: Service, qty = 1, link = ""): void => {
    const safeQty = Number.isFinite(qty) ? qty : parseInt(String(qty), 10) || 0;
    if (safeQty <= 0) return;
    setCart((prev) => {
      const existing = prev.find((p) => p.serviceId === service.id);
      if (existing) {
        return prev.map((p) =>
          p.serviceId === service.id
            ? { ...p, quantity: p.quantity + safeQty, link: link || p.link }
            : p
        );
      }
      return [
        ...prev,
        {
          serviceId: service.id,
          name: service.name,
          price: service.price,
          quantity: safeQty,
          link,
        },
      ];
    });
  };

  const updateQuantity = (serviceId: string, qty: number): void => {
    const safe = Number.isFinite(qty) ? qty : parseInt(String(qty), 10) || 0;
    if (safe < 0) return;
    setCart((prev) =>
      prev.map((p) =>
        p.serviceId === serviceId ? { ...p, quantity: safe } : p
      )
    );
  };

  const updateLink = (serviceId: string, link: string): void => {
    setCart((prev) =>
      prev.map((p) => (p.serviceId === serviceId ? { ...p, link } : p))
    );
  };

  const removeFromCart = (serviceId: string): void => {
    setCart((prev) => prev.filter((p) => p.serviceId !== serviceId));
  };

  const effectiveQuantity = (qty: number): number =>
    dripEnabled ? qty * runs : qty;

  const grandTotal = useMemo<number>(() => {
    return cart.reduce<number>((acc, item) => {
      const totalQty = effectiveQuantity(item.quantity);
      return acc + perUnitPrice(item.price) * totalQty;
    }, 0);
  }, [cart, dripEnabled, runs]);

  const schedulePreview = useMemo<string[]>(() => {
    if (!dripEnabled) return [];
    const preview: string[] = [];
    const now = new Date();
    let next = now;
    for (let i = 0; i < Math.min(runs, 10); i++) {
      next = addMinutes(next, intervalMinutes);
      preview.push(format(next, "yyyy-MM-dd HH:mm"));
    }
    return preview;
  }, [dripEnabled, intervalMinutes, runs]);

  const validate = (): string | null => {
    if (cart.length === 0) return "Cart must have at least one item.";
    if (cart.some((i) => i.quantity <= 0))
      return "All quantities must be greater than zero.";
    if (cart.some((i) => !i.link || i.link.trim().length === 0))
      return "Each service requires a link.";
    if (dripEnabled) {
      if (intervalMinutes < 1) return "Interval minutes must be at least 1.";
      if (runs < 1) return "Runs must be at least 1.";
    }
    return null;
  };

  const handleSubmit = async (): Promise<void> => {
    setErrors(null);
    const v = validate();
    if (v) {
      setErrors(v);
      return;
    }

    setSubmitting(true);
    try {
      const payload: OrderPayload = {
        categoryId,
        items: cart.map((c) => ({
          serviceId: c.serviceId,
          quantity: effectiveQuantity(c.quantity),
          unitPrice: perUnitPrice(c.price),
        })),
        dripFeed: {
          enabled: dripEnabled,
          intervalMinutes: dripEnabled ? intervalMinutes : 0,
          runs: dripEnabled ? runs : 0,
        },
        totalPrice: grandTotal,
      };

      console.log("Order payload:", payload);

      // reset
      setCart([]);
      setDripEnabled(false);
      setIntervalMinutes(60);
      setRuns(1);
      setErrors(null);

      // keep behavior identical: notify user
      // In production replace alert with toasts
      alert("Order submitted. Check console for payload.");
    } catch (err) {
      console.error(err);
      setErrors("Failed to submit order.");
    } finally {
      setSubmitting(false);
    }
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    // only run if there are params
    const catParam = searchParams?.get("category");
    const svcParam = searchParams?.get("service");

    if (!catParam && !svcParam) return;

    // find category by id or name (case-insensitive)
    if (catParam) {
      const foundCat = categories.find(
        (c) =>
          c.id === catParam ||
          c.name === catParam ||
          c.name.toLowerCase() === String(catParam).toLowerCase() ||
          c.id === String(catParam)
      );
      if (foundCat) {
        setCategoryId(foundCat.id);
      }
    }

    // if service param present, find service and add to cart (qty 1)
    if (svcParam) {
      // allow numeric or string ids
      const svc = services.find((s) => String(s.id) === String(svcParam));
      if (svc) {
        // ensure category is set to the service's category if not already done
        if (!catParam) {
          const catForSvc = categories.find(
            (c) => c.id === svc.categoryId || c.name === svc.categoryId
          );
          if (catForSvc) setCategoryId(catForSvc.id);
        }
        // add with qty 1 if not already in cart
        setCart((prev) => {
          const exists = prev.find((p) => p.serviceId === svc.id);
          if (exists) return prev;
          return [
            ...prev,
            {
              serviceId: svc.id,
              name: svc.name,
              price: svc.price,
              quantity: 1,
              link: "",
            },
          ];
        });

        // optional: scroll to cart or focus right-hand cart - you can implement scrollIntoView if desired
      }
    }
  }, [searchParams]); // run once when the route loads with params

  // ---- Render ----
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: service selector and list */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                New Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:items-end md:gap-6 gap-4">
                <div className="flex-1 min-w-0 w-full gap-2 flex flex-col">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={categoryId}
                    onValueChange={(v: string) => setCategoryId(v)}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            <div className="flex items-center gap-3">
                              <img
                                src={c.img}
                                alt={c.name}
                                className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                              />
                              <div className="font-medium truncate">
                                {c.name}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full gap-2 flex flex-col">
                  <Label>Quick actions</Label>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        const svc = services.find(
                          (s) => s.categoryId === categoryId
                        );
                        if (svc) addToCart(svc, 1, "");
                      }}
                      className="w-[50%]"
                    >
                      Add first
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        services
                          .filter((s) => s.categoryId === categoryId)
                          .forEach((s) => addToCart(s, 1, ""));
                      }}
                      className="w-[50%]"
                    >
                      Add all
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Label>Services</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {filteredServices.map((s) => {
                    const inCart = cart.find((c) => c.serviceId === s.id) ?? {
                      quantity: 0,
                      link: "",
                    };
                    const perUnit = perUnitPrice(s.price);
                    const effectiveQty = effectiveQuantity(inCart.quantity);
                    const subtotal = perUnit * effectiveQty;

                    return (
                      <Card
                        key={s.id}
                        className="rounded-xl p-4 shadow-md transform transition-transform hover:-translate-y-1 min-h-[220px] flex flex-col"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={s.img}
                            alt={s.name}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-lg truncate">
                              {s.name}
                            </div>
                            <div className="text-sm">
                              {formatCurrency(s.price)} per 1000
                            </div>
                            <div className="text-sm mt-1">
                              Per unit: ${perUnit.toFixed(4)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex-1 flex flex-col justify-end gap-3">
                          <Input
                            placeholder="Enter link (required)"
                            value={inCart.link}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => updateLink(s.id, e.target.value)}
                          />

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(
                                  s.id,
                                  Math.max(0, inCart.quantity - 1)
                                )
                              }
                            >
                              -
                            </Button>
                            <Input
                              className="w-24 text-center"
                              type="number"
                              min={0}
                              value={inCart.quantity}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                updateQuantity(
                                  s.id,
                                  parseInt(e.target.value || "0", 10)
                                )
                              }
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(s, 1, inCart.link)}
                            >
                              +
                            </Button>
                            <div className="ml-auto text-sm text-gray-700">
                              Subtotal:{" "}
                              <span className="font-semibold">
                                ${subtotal.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <Button
                            className="mt-2"
                            onClick={() => addToCart(s, 1, inCart.link)}
                          >
                            Add to cart
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile cart preview */}
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
                      const svc = services.find((s) => s.id === c.serviceId)!;
                      const perUnit = perUnitPrice(c.price);
                      const effQty = effectiveQuantity(c.quantity);
                      return (
                        <div
                          key={c.serviceId}
                          className="flex items-center gap-4"
                        >
                          <img
                            src={svc.img}
                            alt={svc.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs">
                              {c.quantity} x {dripEnabled ? runs : 1} runs ={" "}
                              {effQty} units
                            </div>
                          </div>
                          <div className="font-semibold">
                            ${(perUnit * effQty).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-between mt-4">
                      <div className="font-medium">Total</div>
                      <div className="font-bold">${grandTotal.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right column: full cart & drip options */}
        <div>
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
                    const effQty = effectiveQuantity(c.quantity);
                    return (
                      <li key={c.serviceId} className="flex gap-3 items-start">
                        <img
                          src={svc.img}
                          alt={svc.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{c.name}</div>
                              <div className="text-xs">
                                Per 1000: {formatCurrency(c.price)}
                              </div>
                              <div className="text-xs">
                                Per unit: ${perUnit.toFixed(4)}
                              </div>
                            </div>
                            <div className="font-semibold">
                              ${(perUnit * effQty).toFixed(2)}
                            </div>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-2">
                            <Input
                              placeholder="Enter link"
                              value={c.link}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => updateLink(c.serviceId, e.target.value)}
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
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
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
                    ${grandTotal.toFixed(2)}
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setIntervalMinutes(
                              parseInt(e.target.value || "0", 10)
                            )
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                          schedulePreview.map((t, idx) => (
                            <li key={idx}>{t}</li>
                          ))
                        )}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              {errors && <div className="text-red-600">{errors}</div>}
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
