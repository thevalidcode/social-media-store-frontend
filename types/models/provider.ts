import { CurrencyCode } from "@/lib/currencyConverter";

export interface Provider {
  storeScopedId: number;
  uid: string;
  name: string;
  image?: string;
  url: string;
  createdAt: string;
  percentage?: number;
  sync?: boolean;
}

export interface ServiceProvider {
  id: number;
  uid: string;
  name: string;
  image: string | null;
  url: string;
  createdAt: Date;
  updatedAt: Date;
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
