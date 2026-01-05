export type StoreStatus = "ACTIVE" | "CANCELED" | "DISABLED" | "EXPIRED";

export type StoreFeatures = {
  stores: number;
  products: number | null;
  analytics: boolean;
  custom_branding: boolean;
  priority_support: boolean;
  store_analytics: boolean;
  unlimited_products: boolean;
  hide_platform_banner: boolean;
  api_access: boolean;
  custom_domain: boolean;
  ai_features: boolean;
  customer_emails: boolean;
  free_ssl: boolean;
  available_templates: number;
  custom_templates: boolean;
  payment_gateways: number;
  default_template: boolean;
  staff_accounts: number;
  social_store_order_sync: boolean;
  social_store_service_sync: boolean;
  [k: string]: any;
};

export type Store = {
  name: string;
  description: string;
  features: StoreFeatures;
  planId: number;
  status: StoreStatus;
  storeId: number;
};
