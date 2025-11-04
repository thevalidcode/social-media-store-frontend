import { CurrencyCode } from "@/lib/currencyConverter";
import { Provider } from "./provider";

export type ServiceStatus = "ACTIVE" | "DISABLED";
export type ServiceType =
  | "MANUAL"
  | "DEFAULT"
  | "PACKAGE"
  | "SUBSCRIPTION"
  | "CUSTOMCOMMENTS";

export interface ServicePublic {
  storeScopedId: number;
  uid: string;
  name: string;
  category: string;
  type: ServiceType;
  min: number;
  max: number;
  icon?: string;
  price: number;
  description?: string;
  dripFeed?: boolean;
  network?: string | null;
  status: ServiceStatus;
  currency: CurrencyCode;
  timestamp?: string;
  refill?: boolean;
  cancel?: boolean;
  position?: number;
  storeId?: number;
  refillDays?: number;
}

export interface Service extends ServicePublic {
  providerPrice?: number;
  providerId?: number;
  providerUid?: string;
  syncQuantity?: boolean;
  syncCatAndName?: boolean;
  provider?: Provider;
}

export type SortOption = { value: string; label: string };

export interface ServiceCategory {
  title: string;
  icon?: string;
  services?: Service[];
}
