import { CurrencyCode } from "@/lib/currencyConverter";
import { Service } from "./service";
import { User } from "./user";

// Order status types
export type OrderStatus =
  | "ACTIVE"
  | "PENDING"
  | "CANCELED"
  | "PARTIAL"
  | "FAILED"
  | "COMPLETED"
  | "PROCESSING";

// Common order fields
type BaseOrder = {
  storeScopedId: number;
  price: number;
  quantity: number;
  start: number;
  remains: number;
  userInitialBalance: number;
  userFinalBalance: number;
  currency: CurrencyCode;
  status: OrderStatus;
  url: string;
  uid: string;
  serviceUid: string;
  userUid: string;
  timestamp: string;
  service: Service;
  providerError?: string;
  comments?: string;
  dripFeed?: boolean;
  user: User;
  interval?: number;
};

// Public order (user-facing)
export type OrderPublic = BaseOrder;

// Internal order (admin/provider-facing)
export type Order = BaseOrder & {
  providerServiceId?: number;
  providerOrderId?: number;
  providerCurrency?: CurrencyCode;
  providerError?: string;
  provider?: string;
  syncOrder?: boolean;
  synced?: boolean;
};
