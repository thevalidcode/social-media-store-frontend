export type AdminStatus = "ACTIVE" | "INACTIVE" | "BANNED";
export type AdminRole =
  | "SUPER"
  | "BASIC"
  | "MANAGER"
  | "SUPPORT_STAFF"
  | "FINANCE_OFFICER"
  | "SERVICE_OPERATOR";

export interface Admin {
  id: number;
  uid: string; // Unique UID
  email: string;
  image: string | null;
  username: string;
  fullName: string | null; // Optional full name
  apiKey: string; // Unique API key
  role: AdminRole;
  status: AdminStatus;
  currency?: string;
  storeId: number; // Foreign key to store
  timestamp: string; // ISO date string
  lastSeen: string; // ISO date string
  onboardingCompleted?: boolean;
}
