"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Service, ServiceCategory } from "@/types";

import { CategorySelect } from "@/app/client/new-order/components/CategorySelect";
import { ServiceList } from "@/app/client/new-order/components/ServiceList";
import { CartDrawer } from "@/app/client/components/CartDrawer";
import { PageContent } from "@/app/(root)/components/page-content";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  CreateBulkOrderProps,
  useCreateBulkOrder,
  useCreateOrder,
} from "@/hooks/use-order";
import { useAppContext } from "@/context/appContext";
import { useGetServicesByPublic } from "@/hooks/use-services";
import { groupServicesByCategory } from "@/lib/groupServices";
import Loading from "@/app/loading";
import { EmptyState } from "@/components/empty-state";
import { ShoppingBag, Server } from "lucide-react";
import { useGetCategories } from "@/hooks/use-category";
import { FeatureGate } from "@/components/FeatureGate";
import { useLocalCart } from "@/hooks/use-local-cart";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { Wallet } from "lucide-react";

export default function NewOrderPage() {
  const [errors, setErrors] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { userInfo, userCurrency, setUserInfo } = useAppContext();
  const { mutateAsync: mutateBulkOrder, isPending: isBulkOrderPending } =
    useCreateBulkOrder();
  const { mutateAsync: mutateOrder, isPending: isOrderPending } =
    useCreateOrder();
  const { data: services, isLoading } = useGetServicesByPublic();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();
  const { storeInfo } = useAppContext();
  const convert = useCurrencyConverter();

  const [categoryWithServices, setCategoryWithServices] = useState<
    ServiceCategory[]
  >([]);
  const { cart, setCart, clearCart, isHydrated, updateDripFeed } = useLocalCart();

  const [category, setCategory] = useState<string>(
    categoryWithServices[0]?.title || "",
  );
  const [filteredServices, setFilteredServices] = useState<Service[]>(
    () => categoryWithServices[0]?.services || [],
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    const parsed = groupServicesByCategory(services || [], categories || []);
    setCategoryWithServices(parsed);
  }, [services, categories]);

  // Update filtered services when category changes
  useEffect(() => {
    const selectedCategory = categoryWithServices.find(
      (c) => c.title === category,
    );
    setFilteredServices(selectedCategory?.services || []);
  }, [category, categoryWithServices]);

  useEffect(() => {
    if (categoryWithServices.length > 0 && !category) {
      setCategory(categoryWithServices[0].title);
      setFilteredServices(categoryWithServices[0].services || []);
    }
  }, [categoryWithServices]);

  // Handle category/service in query params
  useEffect(() => {
    const catParam = searchParams?.get("category");
    const svcParam = searchParams?.get("service");
    const qtyParam = searchParams?.get("quantity");

    if (!catParam && !svcParam) return;

    if (catParam) {
      const foundCat = categoryWithServices.find(
        (c) => c.title.toLowerCase() === catParam.toLowerCase(),
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
          const exists = prev.find((p) => p.serviceUid === svc.uid);
          if (exists) return prev;
          return [
            ...prev,
            {
              serviceId: svc.storeScopedId,
              serviceUid: svc.uid,
              serviceName: svc.name,
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
              dripFeed: false,
              intervalMinutes: 60,
              runs: 1,
              currency: svc.currency || userCurrency,
            },
          ];
        });
      }
    }
  }, [searchParams, categoryWithServices, setCart, userCurrency]);

  const addToCart = (service: Service, qty = 1, link = ""): void => {
    const safeQty = Number.isFinite(qty) ? qty : parseInt(String(qty), 10) || 0;
    if (safeQty <= 0) return;
    setCart((prev) => {
      const existing = prev.find((p) => p.serviceUid === service.uid);
      if (existing) {
        return prev.map((p) =>
          p.serviceUid === service.uid
            ? { ...p, quantity: p.quantity + safeQty, link: link || p.link }
            : p,
        );
      }
      return [
        ...prev,
        {
          serviceId: service.storeScopedId,
          serviceUid: service.uid,
          serviceName: service.name,
          price:
            typeof service.price === "string"
              ? parseFloat(service.price)
              : service.price,
          quantity: safeQty,
          link,
          dripFeed: false,
          intervalMinutes: 60,
          runs: 1,
          currency: service.currency || userCurrency,
        },
      ];
    });
  };

  const updateQuantity = (
    serviceUid: string,
    qty: number,
    service?: Service,
  ): void => {
    const safe = Number.isFinite(qty) ? qty : parseInt(String(qty), 10) || 0;
    if (safe < 0) return;
    const fallbackService =
      service || categoryWithServices.flatMap((c) => c.services || []).find((s) => s.uid === serviceUid);

    const existing = cart.find((p) => p.serviceUid === serviceUid);
    if (!existing && fallbackService && safe > 0) {
      addToCart(fallbackService, safe, "");
      return;
    }

    setCart((prev) =>
      prev.map((p) =>
        p.serviceUid === serviceUid ? { ...p, quantity: safe } : p,
      ),
    );
  };

  const updateLink = (serviceUid: string, link: string, service?: Service): void => {
    const fallbackService =
      service || categoryWithServices.flatMap((c) => c.services || []).find((s) => s.uid === serviceUid);
    const existing = cart.find((p) => p.serviceUid === serviceUid);

    if (!existing && fallbackService) {
      if (link.trim()) {
        addToCart(fallbackService, 1, link);
      }
      return;
    }

    setCart((prev) =>
      prev.map((p) => (p.serviceUid === serviceUid ? { ...p, link } : p)),
    );
  };

  const removeFromCart = (serviceUid: string): void => {
    setCart((prev) => prev.filter((p) => p.serviceUid !== serviceUid));
  };

  const userBalance = Number.parseFloat(String(userInfo?.balance || 0)) || 0;
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
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
  }, [cart, convert, userCurrency]);
  const projectedBalance = userBalance - cartTotal;

  const validate = (): string | null => {
    if (cart.length === 0) return "Cart must have at least one item.";
    if (cart.some((i) => i.quantity <= 0))
      return "All quantities must be greater than zero.";
    if (cart.some((i) => !i.link.trim()))
      return "Each service requires a link.";
    return null;
  };

  const handleCheckout = async (): Promise<void> => {
    setErrors(null);
    const validationError = validate();
    if (validationError) {
      setErrors(validationError);
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const handleOrderSuccess = () => {
        toast.success("Order submitted successfully!");
        clearCart();
        setErrors(null);
      };

      const handleOrderError = (error: any) => {
        const errorMsg = error?.message || "Failed to submit order.";
        setErrors(errorMsg);
        toast.error(errorMsg);
      };

      const handleOrderSettled = () => setSubmitting(false);

      if (cart.length === 1) {
        const item = cart[0];
        const totalQty = item.dripFeed
          ? item.quantity * (item.runs || 1)
          : item.quantity;
        const singleOrder = {
          serviceUid: item.serviceUid,
          quantity: totalQty,
          url: item.link,
          dripFeed: item.dripFeed,
          interval: item.dripFeed ? item.intervalMinutes : undefined,
          runs: item.dripFeed ? item.runs : undefined,
          userUid: userInfo?.uid!,
        };

        await mutateOrder(singleOrder, {
          onSuccess: (response: { balance?: number }) => {
            if (
              typeof response?.balance === "number" &&
              Number.isFinite(response.balance)
            ) {
              const current = userInfo;
              if (current) {
                // Keep wallet value in sync after successful checkout.
                const updatedBalance = response.balance.toFixed(2);
                if (updatedBalance !== current.balance) {
                  const nextUser = { ...current, balance: updatedBalance };
                  setUserInfo(nextUser);
                }
              }
            }
            handleOrderSuccess();
          },
          onError: handleOrderError,
          onSettled: handleOrderSettled,
        });
      } else {
        const bulkOrderPayload: CreateBulkOrderProps = {
          orders: cart.map((c) => {
            const totalQty = c.dripFeed
              ? c.quantity * (c.runs || 1)
              : c.quantity;
            return {
              serviceUid: c.serviceUid,
              quantity: totalQty,
              url: c.link,
              dripFeed: c.dripFeed,
              interval: c.dripFeed ? c.intervalMinutes || 60 : undefined,
              runs: c.dripFeed ? c.runs || 1 : undefined,
              userUid: userInfo?.uid!,
            };
          }),
        };

        await mutateBulkOrder(bulkOrderPayload, {
          onSuccess: (response: { balance?: number }) => {
            if (
              typeof response?.balance === "number" &&
              Number.isFinite(response.balance)
            ) {
              const current = userInfo;
              if (current) {
                const updatedBalance = response.balance.toFixed(2);
                if (updatedBalance !== current.balance) {
                  setUserInfo({ ...current, balance: updatedBalance });
                }
              }
            }
            handleOrderSuccess();
          },
          onError: handleOrderError,
          onSettled: handleOrderSettled,
        });
      }
    } catch (error) {
      console.error(error);
      setErrors("Unexpected error occurred.");
      setSubmitting(false);
    }
  };

  const isSubscriptionActive = storeInfo?.subscriptionStatus === "ACTIVE";
  const allServices = useMemo<Service[]>(() => {
    return categoryWithServices.flatMap((cat) => cat.services || []);
  }, [categoryWithServices]);

  // Compute per-service errors
  const serviceErrors = useMemo(() => {
    const errors = new Map<string, string[]>();
    cart.forEach((item) => {
      const service = allServices.find((s) => s.uid === item.serviceUid);
      if (!service) return;

      const itemErrors: string[] = [];
      if (item.quantity < service.min) {
        itemErrors.push(`Min: ${service.min} (current: ${item.quantity})`);
      }
      if (item.quantity > service.max) {
        itemErrors.push(`Max: ${service.max} (current: ${item.quantity})`);
      }
      if (!item.link.trim()) {
        itemErrors.push("No link provided");
      }
      if (itemErrors.length > 0) {
        errors.set(item.serviceUid, itemErrors);
      }
    });
    return errors;
  }, [cart, allServices]);

  if (isLoading || isCategoriesLoading || !isHydrated) {
    return <Loading />;
  }

  if (filteredServices.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="No Service Found"
        description="No services have been created yet."
      />
    );
  }

  return (
    <div className="min-h-screen md:p-4 p-2">
      <FeatureGate
        isAllowed={isSubscriptionActive}
        featureLabel="Order Creation"
        description="You need an active subscription to create orders. Please contact the store owner to renew the subscription."
        variant="page"
      >
        {/* Header Section */}
        <div className="mb-8">
          <PageContent pageType="ORDER" />
          <div className="flex items-center justify-between mt-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Create New Order
              </h1>
              <p className="text-muted-foreground mt-2">
                {cart.length > 0 && (
                  <span className="font-semibold text-primary">
                    {cart.length} item{cart.length !== 1 ? "s" : ""} in cart
                  </span>
                )}
                {cart.length === 0 && (
                  <span>Browse services and add to your cart</span>
                )}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-1.5 text-sm">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-semibold text-foreground">
                  {userBalance.toFixed(2)} {userCurrency}
                </span>
              </div>
            </div>
            {cart.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary">
                  {cart.length} items
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category Filter Card */}
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Filter Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <CategorySelect
                    value={category}
                    onChange={setCategory}
                    categories={categoryWithServices}
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      const first = filteredServices[0];
                      if (first) addToCart(first, 1, "");
                      toast("Added to cart");
                    }}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Add first
                  </Button>
                  <Button
                    onClick={() => {
                      if (filteredServices.length > 0) {
                        filteredServices.forEach((s) => addToCart(s, 1, ""));
                        toast.success(
                          `Added ${filteredServices.length} services to cart`,
                        );
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Add all
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Services Grid Card */}
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {category || "Services"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceList
                  services={filteredServices}
                  category={
                    categoryWithServices.find(
                      (c) => c.title === category,
                    ) as ServiceCategory
                  }
                  cartItems={cart.map((c) => ({
                    serviceId: c.serviceId,
                    serviceUid: c.serviceUid,
                    quantity: c.quantity,
                    link: c.link,
                    dripFeed: c.dripFeed,
                    intervalMinutes: c.intervalMinutes,
                    runs: c.runs,
                  }))}
                  addToCart={addToCart}
                  updateQuantity={updateQuantity}
                  updateLink={updateLink}
                  updateDripFeed={updateDripFeed}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Cart Summary (Desktop)*/}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Your cart is empty
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.serviceUid}
                          className="p-2 rounded bg-card border border-border text-xs"
                        >
                          <p className="font-semibold text-foreground truncate">
                            {item.serviceName}
                          </p>
                          <p className="text-muted-foreground">
                            Qty: {item.quantity}{" "}
                            {item.dripFeed && (
                              <span className="text-primary">
                                × {item.runs} runs
                              </span>
                            )}
                          </p>
                          <p className="text-muted-foreground">
                            Total qty: {item.dripFeed ? item.quantity * (item.runs || 1) : item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cart total</span>
                      <span className="font-semibold text-foreground">
                        {cartTotal.toFixed(2)} {userCurrency}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between">
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
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || submitting}
                    className="w-full"
                  >
                    {submitting ? "Processing..." : "Checkout"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </FeatureGate>

      {/* Cart Drawer - Mobile & Desktop */}
      <CartDrawer
        cart={cart}
        onCheckout={handleCheckout}
        submitting={submitting || isBulkOrderPending || isOrderPending}
        error={errors}
        onUpdateQuantity={updateQuantity}
        onUpdateLink={updateLink}
        onUpdateDripFeed={updateDripFeed}
        onRemoveFromCart={removeFromCart}
        serviceErrors={serviceErrors}
        userBalance={userBalance}
      />
    </div>
  );
}
