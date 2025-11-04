export type PaymentGatewayStatus = "ACTIVE" | "INACTIVE";
export type PaymentGatewayPlatform = "MANUAL" | "PAYSTACK" | "FLUTTERWAVE";

export interface PaymentGateway {
  id: number;
  storeScopedId: number;
  uid: string;
  platform: PaymentGatewayPlatform;
  name: string;
  description?: string | null;
  signature?: string | null;
  feePercent?: number;
  secretKey?: Record<string, any> | null;
  image: string;
  status: PaymentGatewayStatus;
  createdAt: string; // ISO date string
  storeId: number;
  position: number;
  min: string;
  max: string;
}
