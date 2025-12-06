export type CategoryStatus = "ACTIVE" | "DISABLED";

export interface Category {
  storeScopedId: number;
  uid: string;
  name: string;
  icon?: string;
  description?: string;
  status: CategoryStatus;
  timestamp?: string;
  position?: number;
}
