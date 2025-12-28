"use client";

import React, { useEffect, useMemo, useState } from "react";
import { addMinutes, format } from "date-fns";
import { useSearchParams } from "next/navigation";
import type { Service, ServiceCategory } from "@/types";

import { CategorySelect } from "./components/CategorySelect";
import { ServiceList } from "./components/ServiceList";
import { CartSidebar } from "./components/CartSidebar";
import { CartMobile } from "./components/CartMobile";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreateBulkOrderProps, useCreateBulkOrder } from "@/hooks/use-order";
import { useAppContext } from "@/context/appContext";
import { useGetServicesByPublic } from "@/hooks/use-services";
import { groupServicesByCategory } from "@/lib/groupServices";
import Loading from "@/app/loading";
import { EmptyState } from "@/components/empty-state";
import { Server } from "lucide-react";
import { useGetCategories } from "@/hooks/use-category";

interface CartItem {
  serviceId: number; // The store-scoped ID of the service
  serviceUid: string;
  name: string;
  price: number;
  quantity: number;
  link: string;
}

interface DripFeedPayload {
  enabled: boolean;
  intervalMinutes: number;
  runs: number;
}

interface OrderPayload {
  category: string;
  items: { serviceId: number; quantity: number; unitPrice: number }[];
  dripFeed: DripFeedPayload;
  totalPrice: number;
}

const perUnitPrice = (price: number): number => price / 1000;

export default function NewOrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dripEnabled, setDripEnabled] = useState<boolean>(false);
  const [intervalMinutes, setIntervalMinutes] = useState<number>(60);
  const [runs, setRuns] = useState<number>(1);
  const [errors, setErrors] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { userInfo } = useAppContext();
  const { mutate } = useCreateBulkOrder();
  const { data: services, isLoading } = useGetServicesByPublic();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();

  const [categoryWithServices, setCategoryWithServices] = useState<
    ServiceCategory[]
  >([]);

  const [category, setCategory] = useState<string>(
    categoryWithServices[0]?.title || ""
  );
  const [filteredServices, setFilteredServices] = useState<Service[]>(
    () => categoryWithServices[0]?.services || []
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    const parsed = groupServicesByCategory(services || [], categories || []);
    setCategoryWithServices(parsed);
  }, [services, categories]);

  // Update filtered services when category changes
  useEffect(() => {
    const selectedCategory = categoryWithServices.find(
      (c) => c.title === category
    );
    setFilteredServices(selectedCategory?.services || []);
  }, [category, categoryWithServices]);

  useEffect(() => {
    if (categoryWithServices.length > 0 && !category) {
      setCategory(categoryWithServices[0].title);
      setFilteredServices(categoryWithServices[0].services || []);
    }
  }, [categoryWithServices]);

  // handle category/service in query params
  useEffect(() => {
    const catParam = searchParams?.get("category");
    const svcParam = searchParams?.get("service");
    const qtyParam = searchParams?.get("quantity");

    if (!catParam && !svcParam) return;

    if (catParam) {
      const foundCat = categoryWithServices.find(
        (c) => c.title.toLowerCase() === catParam.toLowerCase()
      );
      if (foundCat) setCategory(foundCat.title);
    }

    if (svcParam) {
      const svc = categoryWithServices
        .flatMap((c) => c.services || [])
        .find((s) => String(s.storeScopedId) === String(svcParam));
      if (svc) {
        if (!catParam) setCategory(svc.category);
        setCart((prev) => {
          const exists = prev.find((p) => p.serviceId === svc.storeScopedId);
          if (exists) return prev;
          return [
            ...prev,
            {
              serviceId: svc.storeScopedId,
              serviceUid: svc.uid,
              name: svc.name,
              price:
                typeof svc.price === "string"
                  ? parseFloat(svc.price)
                  : svc.price,
              quantity: qtyParam
                ? Number.isFinite(Number(qtyParam))
                  ? Number(qtyParam)
                  : parseInt(qtyParam, 10) || 1
                : 1,
              link: "",
            },
          ];
        });
      }
    }
  }, [searchParams]);

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
    let next = new Date();
    for (let i = 0; i < Math.min(runs, 10); i++) {
      next = addMinutes(next, intervalMinutes);
      preview.push(format(next, "yyyy-MM-dd HH:mm"));
    }
    return preview;
  }, [dripEnabled, intervalMinutes, runs]);

  const allServices = useMemo<Service[]>(() => {
    return categoryWithServices.flatMap((cat) => cat.services || []);
  }, [categoryWithServices]);

  if (isLoading || isCategoriesLoading) {
    return <Loading />;
  }

  if (filteredServices.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="No Service Found"
        description="No service have been created yet."
      />
    );
  }
  const addToCart = (service: Service, qty = 1, link = ""): void => {
    const safeQty = Number.isFinite(qty) ? qty : parseInt(String(qty), 10) || 0;
    if (safeQty <= 0) return;
    setCart((prev) => {
      const existing = prev.find((p) => p.serviceUid === service.uid);
      if (existing) {
        return prev.map((p) =>
          p.serviceUid === service.uid
            ? { ...p, quantity: p.quantity + safeQty, link: link || p.link }
            : p
        );
      }
      return [
        ...prev,
        {
          serviceId: service.storeScopedId,
          serviceUid: service.uid,
          name: service.name,
          price:
            typeof service.price === "string"
              ? parseFloat(service.price)
              : service.price,
          quantity: safeQty,
          link,
        },
      ];
    });
  };

  const updateQuantity = (serviceUid: string, qty: number): void => {
    const safe = Number.isFinite(qty) ? qty : parseInt(String(qty), 10) || 0;
    if (safe < 0) return;
    setCart((prev) =>
      prev.map((p) =>
        p.serviceUid === serviceUid ? { ...p, quantity: safe } : p
      )
    );
  };

  const updateLink = (serviceUid: string, link: string): void => {
    setCart((prev) =>
      prev.map((p) => (p.serviceUid === serviceUid ? { ...p, link } : p))
    );
  };

  const removeFromCart = (serviceUid: string): void => {
    setCart((prev) => prev.filter((p) => p.serviceUid !== serviceUid));
  };

  const validate = (): string | null => {
    if (cart.length === 0) return "Cart must have at least one item.";
    if (cart.some((i) => i.quantity <= 0))
      return "All quantities must be greater than zero.";
    if (cart.some((i) => !i.link.trim()))
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
        category,
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

      const orders: CreateBulkOrderProps = {
        orders: cart.map((c) => ({
          serviceUid: c.serviceUid,
          quantity: effectiveQuantity(c.quantity),
          url: c.link,
          dripFeed: dripEnabled,
          interval: dripEnabled ? intervalMinutes : undefined,
          runs: dripEnabled ? runs : undefined,
          userUid: userInfo?.uid!,
        })),
      };

      mutate(orders, {
        onSuccess: () => {
          toast.success("Order submitted.");
          setCart([]);
          setDripEnabled(false);
          setIntervalMinutes(60);
          setRuns(1);
          setErrors(null);
        },
        onError: (err: any) => {
          console.error(err);
          setErrors("Failed to submit order.");
          toast.error("Failed to submit order.");
        },
        onSettled: () => setSubmitting(false),
      });
    } catch (err) {
      console.error(err);
      setErrors("Unexpected error.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                New Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:items-end md:gap-6 gap-4">
                <CategorySelect
                  value={category}
                  onChange={setCategory}
                  categories={categoryWithServices}
                />

                <div className="w-full gap-2 flex flex-col">
                  <Label>Quick actions</Label>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        const first = filteredServices[0];
                        if (first) addToCart(first, 1, "");
                      }}
                      className="w-[50%]"
                    >
                      Add first
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        filteredServices.forEach((s) => addToCart(s, 1, ""));
                      }}
                      className="w-[50%]"
                    >
                      Add all
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <ServiceList
                  services={filteredServices}
                  category={
                    categoryWithServices.find(
                      (c) => c.title === category
                    ) as ServiceCategory
                  }
                  cartItems={cart.map((c) => ({
                    serviceId: c.serviceId,
                    serviceUid: c.serviceUid,
                    quantity: c.quantity,
                    link: c.link,
                  }))}
                  addToCart={addToCart}
                  updateQuantity={updateQuantity}
                  updateLink={updateLink}
                />
              </div>
            </CardContent>
          </Card>

          <CartMobile
            cart={cart}
            services={allServices}
            dripEnabled={dripEnabled}
            runs={runs}
          />
        </div>

        {/* Right */}
        <div>
          <CartSidebar
            cart={cart}
            services={allServices}
            dripEnabled={dripEnabled}
            setDripEnabled={setDripEnabled}
            intervalMinutes={intervalMinutes}
            setIntervalMinutes={setIntervalMinutes}
            runs={runs}
            setRuns={setRuns}
            grandTotal={grandTotal}
            updateQuantity={updateQuantity}
            updateLink={updateLink}
            removeFromCart={removeFromCart}
            handleSubmit={handleSubmit}
            errors={errors}
            submitting={submitting}
            schedulePreview={schedulePreview}
          />
        </div>
      </div>
    </div>
  );
}
