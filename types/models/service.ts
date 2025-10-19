export type ServiceStatus = "active" | "disabled";
export type ServiceType =
  | "Default"
  | "Package"
  | "Subscription"
  | "Custom Comments";

export interface Service {
  id: number;
  name: string;
  icon: string;
  category: string;
  type: ServiceType;
  price: number;
  min: number;
  max: number;
  status: ServiceStatus;
  description?: string;
}
