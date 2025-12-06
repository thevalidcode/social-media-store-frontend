import { CurrencyCode } from "@/lib/currencyConverter";

export interface Provider {
  storeScopedId: number;
  uid: string;
  name: string;
  image?: string;
  url: string;
  timestamp: string;
  percentage?: number;
  sync?: boolean;
}

export interface ProviderService {
  service: number;
  name: string;
  type: string;
  min: number;
  max: number;
  rate: string;
  category: string;
  description: string;
  currency: CurrencyCode;
  network: string;
  dripFeed: boolean;
  cancel: boolean;
}
