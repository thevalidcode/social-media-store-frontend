"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { get, set } from "idb-keyval";
import type { CurrencyCode } from "@/lib/currencyConverter";

export interface CartItemLocal {
  serviceId: number;
  serviceUid: string;
  serviceName: string;
  quantity: number;
  link: string;
  dripFeed: boolean;
  intervalMinutes: number;
  runs: number;
  price: number;
  currency: CurrencyCode;
}

const CART_STORAGE_KEY = "smm_cart";

/**
 * Hook for managing cart state with IndexedDB persistence
 * Call this from any page that needs cart functionality
 * Cart data persists across page navigation
 * Automatically clears after successful order creation
 */
export function useLocalCart() {
  const [cart, setCart] = useState<CartItemLocal[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from IndexedDB on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await get<CartItemLocal[]>(CART_STORAGE_KEY);
        setCart(Array.isArray(stored) ? stored : []);
      } catch (error) {
        console.error("Failed to load cart from IndexedDB:", error);
        setCart([]);
      } finally {
        setIsHydrated(true);
      }
    };

    loadCart();
  }, []);

  // Persist cart to IndexedDB whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    set(CART_STORAGE_KEY, cart).catch((error) => {
      console.error("Failed to save cart to IndexedDB:", error);
    });
  }, [cart, isHydrated]);

  const addToCart = (service: CartItemLocal): void => {
    setCart((prev) => {
      const existing = prev.find((p) => p.serviceUid === service.serviceUid);
      if (existing) {
        return prev.map((p) =>
          p.serviceUid === service.serviceUid
            ? { ...p, quantity: p.quantity + service.quantity }
            : p,
        );
      }
      return [...prev, service];
    });
  };

  const setCartAndPersist = (items: CartItemLocal[]): void => {
    setCart(items);
  };

  const updateQuantity = (serviceUid: string, qty: number): void => {
    if (qty < 0) return;
    if (qty === 0) {
      removeFromCart(serviceUid);
      return;
    }
    setCart((prev) =>
      prev.map((p) =>
        p.serviceUid === serviceUid ? { ...p, quantity: qty } : p,
      ),
    );
  };

  const updateLink = (serviceUid: string, link: string): void => {
    setCart((prev) =>
      prev.map((p) => (p.serviceUid === serviceUid ? { ...p, link } : p)),
    );
  };

  const updateDripFeed = (
    serviceUid: string,
    dripFeed: boolean,
    runs?: number,
    interval?: number,
  ): void => {
    setCart((prev) =>
      prev.map((p) =>
        p.serviceUid === serviceUid
          ? {
              ...p,
              dripFeed,
              runs: dripFeed ? runs || p.runs : 1,
              intervalMinutes: dripFeed ? interval || p.intervalMinutes : 60,
            }
          : p,
      ),
    );
  };

  const removeFromCart = (serviceUid: string): void => {
    setCart((prev) => prev.filter((p) => p.serviceUid !== serviceUid));
  };

  const clearCart = (): void => {
    setCart([]);
    set(CART_STORAGE_KEY, []).catch((error) => {
      console.error("Failed to clear cart from IndexedDB:", error);
    });
  };

  const getCart = (): CartItemLocal[] => cart;

  const getCartCount = (): number => cart.length;

  return {
    cart,
    isHydrated,
    addToCart,
    updateQuantity,
    updateLink,
    updateDripFeed,
    removeFromCart,
    clearCart,
    getCart,
    getCartCount,
    setCart: setCartAndPersist as Dispatch<SetStateAction<CartItemLocal[]>>,
  };
}
