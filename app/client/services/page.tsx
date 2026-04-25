"use client";

import { useMemo, useState } from "react";
import { useGetServicesByPublic } from "@/hooks/use-services";
import ServicesList from "./components/ServicesList";
import { groupServicesByCategory } from "@/lib/groupServices";
import Loading from "@/app/loading";
import { Server } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useGetCategories } from "@/hooks/use-category";
import { useLocalCart } from "@/hooks/use-local-cart";
import { CartDrawer } from "@/app/client/components/CartDrawer";
import { useAppContext } from "@/context/appContext";
import { useCreateBulkOrder, useCreateOrder } from "@/hooks/use-order";
import { toast } from "sonner";
import type { Service } from "@/types";

export default function ServicesPage() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { data: services, isLoading } = useGetServicesByPublic();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();
  const { userInfo, userCurrency } = useAppContext();
  const { cart, setCart, clearCart, isHydrated } = useLocalCart();
  const { mutateAsync: mutateOrder, isPending: isOrderPending } =
    useCreateOrder();
  const { mutateAsync: mutateBulkOrder, isPending: isBulkOrderPending } =
    useCreateBulkOrder();

  const categoryWithServices = useMemo(
    () => groupServicesByCategory(services || [], categories || []),
    [services, categories],
  );

  const allServices = useMemo<Service[]>(
    () => categoryWithServices.flatMap((cat) => cat.services || []),
    [categoryWithServices],
  );

  const addToCartFromServices = (service: Service, quantity = 1) => {
    const safeQty = Number.isFinite(quantity)
      ? quantity
      : parseInt(String(quantity), 10) || 1;
    if (safeQty <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.serviceUid === service.uid);
      if (existing) {
        return prev.map((item) =>
          item.serviceUid === service.uid
            ? { ...item, quantity: item.quantity + safeQty }
            : item,
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
          link: "",
          dripFeed: false,
          intervalMinutes: 60,
          runs: 1,
          currency: service.currency || userCurrency,
        },
      ];
    });

    toast.success("Added to cart");
  };

  const updateQuantity = (serviceUid: string, quantity: number) => {
    const safeQty = Number.isFinite(quantity)
      ? quantity
      : parseInt(String(quantity), 10) || 0;
    if (safeQty < 0) return;

    setCart((prev) =>
      prev.map((item) =>
        item.serviceUid === serviceUid ? { ...item, quantity: safeQty } : item,
      ),
    );
  };

  const updateLink = (serviceUid: string, link: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.serviceUid === serviceUid ? { ...item, link } : item,
      ),
    );
  };

  const removeFromCart = (serviceUid: string) => {
    setCart((prev) => prev.filter((item) => item.serviceUid !== serviceUid));
  };

  const serviceErrors = useMemo(() => {
    const errors = new Map<string, string[]>();

    cart.forEach((item) => {
      const currentService = allServices.find((service) => service.uid === item.serviceUid);
      if (!currentService) return;

      const itemErrors: string[] = [];
      if (item.quantity < currentService.min) {
        itemErrors.push(`Min: ${currentService.min} (current: ${item.quantity})`);
      }
      if (item.quantity > currentService.max) {
        itemErrors.push(`Max: ${currentService.max} (current: ${item.quantity})`);
      }
      if (!item.link.trim()) {
        itemErrors.push("No link provided");
      }
      if (itemErrors.length > 0) {
        errors.set(item.serviceUid, itemErrors);
      }
    });

    return errors;
  }, [allServices, cart]);

  const validate = (): string | null => {
    if (cart.length === 0) return "Cart must have at least one item.";
    if (cart.some((item) => item.quantity <= 0)) {
      return "All quantities must be greater than zero.";
    }
    if (cart.some((item) => !item.link.trim())) {
      return "Each service requires a link.";
    }
    return null;
  };

  const handleCheckout = async () => {
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      if (cart.length === 1) {
        const item = cart[0];
        const totalQty = item.dripFeed
          ? item.quantity * (item.runs || 1)
          : item.quantity;

        await mutateOrder({
          serviceUid: item.serviceUid,
          quantity: totalQty,
          url: item.link,
          dripFeed: item.dripFeed,
          interval: item.dripFeed ? item.intervalMinutes : undefined,
          runs: item.dripFeed ? item.runs : undefined,
          userUid: userInfo?.uid || "",
        });
      } else {
        await mutateBulkOrder({
          orders: cart.map((item) => {
            const totalQty = item.dripFeed
              ? item.quantity * (item.runs || 1)
              : item.quantity;

            return {
              serviceUid: item.serviceUid,
              quantity: totalQty,
              url: item.link,
              dripFeed: item.dripFeed,
              interval: item.dripFeed ? item.intervalMinutes || 60 : undefined,
              runs: item.dripFeed ? item.runs || 1 : undefined,
              userUid: userInfo?.uid || "",
            };
          }),
        });
      }

      toast.success("Order submitted successfully!");
      clearCart();
      setError(null);
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error
          ? checkoutError.message
          : "Failed to submit order.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || isCategoriesLoading || !isHydrated) {
    return <Loading />;
  }

  if (!services || services.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="No Service Found"
        description="No service has been created yet."
      />
    );
  }

  return (
    <div className="space-y-6 px-3">
      <ServicesList
        categoryWithServices={categoryWithServices}
        onAddToCart={addToCartFromServices}
      />

      <CartDrawer
        cart={cart}
        onCheckout={handleCheckout}
        submitting={submitting || isOrderPending || isBulkOrderPending}
        error={error}
        onUpdateQuantity={updateQuantity}
        onUpdateLink={updateLink}
        onRemoveFromCart={removeFromCart}
        serviceErrors={serviceErrors}
      />
    </div>
  );
}
