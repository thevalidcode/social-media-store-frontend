export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export type PaymentMethod = "FLUTTERWAVE" | "PAYSTACK" | "MANUAL";

export interface Payment {
  id: number;
  uid: string;
  amount: number;
  chargedAmount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  storeScopedId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    uid: string;
    email: string;
    username: string;
    storeScopedId: number;
  };
}

export interface PaymentsResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  method?: PaymentMethod;
  search?: string;
}
