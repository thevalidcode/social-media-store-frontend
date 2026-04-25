export type PaymentGatewayStatus = "ACTIVE" | "DISABLED";
export type PaymentGatewayPlatform =
  | "MANUAL"
  | "PAYSTACK"
  | "FLUTTERWAVE"
  | "CREDIT";

export interface PaymentGateway {
  id: number;
  storeScopedId: number;
  uid: string;
  platform: PaymentGatewayPlatform;
  name: string;
  description?: string;
  content?: string;
  signature?: string;
  feePercent?: number;
  status: PaymentGatewayStatus;
  createdAt: Date; // ISO date string
  position: number;
  webhookUrl: string;
  min: string;
  max: string;
  currency: string;
}

export interface PaymentGatewayPublic
  extends Omit<PaymentGateway, "signature" | "id" | "webhookUrl"> {}
