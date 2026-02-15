export type PaymentGatewayStatus = "ACTIVE" | "DISABLED";
export type PaymentGatewayPlatform =
  | "MANUAL"
  | "PAYSTACK"
  | "FLUTTERWAVE"
  | "REFERRAL";

export interface PaymentGateway {
  id: number;
  storeScopedId: number;
  uid: string;
  platform: PaymentGatewayPlatform;
  name: string;
  description?: string;
  signature?: string;
  feePercent?: number;
  status: PaymentGatewayStatus;
  createdAt: Date; // ISO date string
  position: number;
  webhookUrl: string;
  min: string;
  max: string;
}

export interface PaymentGatewayPublic
  extends Omit<PaymentGateway, "signature" | "id" | "uid" | "webhookUrl"> {}
