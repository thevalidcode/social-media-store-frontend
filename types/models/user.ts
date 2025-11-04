import { CurrencyCode } from "@/lib/currencyConverter";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";
export type UserRole = "BASIC" | "VIP" | "RESELLER" | "PARTNER";

export interface User {
  id: number;
  storeScopedId: number;
  refCode?: number | null;
  uid: string;
  email: string;
  image?: string | null;
  fullName?: string;
  username: string;
  apiKey: string;
  role: UserRole;
  status: UserStatus;
  balance: string;
  spent: string;
  timestamp: string;
  lastSeen: string;
  currency: CurrencyCode;
  ref?: number | null;
}
