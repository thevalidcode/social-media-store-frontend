export type PaymentGateway = {
  id: string;
  name: string;
  platform: string;
  icon: string;
  description: string;
  publicKey: string;
  secretKey: string;
  webhookUrl: string;
  status: "active" | "inactive";
};