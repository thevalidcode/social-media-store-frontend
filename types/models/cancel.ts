// Cancel status types
export type CancelStatus =
  | "PENDING"
  | "CANCELED"
  | "REJECTED"
  | "COMPLETED"
  | "ACTIVE"
  | "ERROR";

// Public cancel (user-facing)
export type CancelPublic = {
  storeScopedId: number;
  uid: string;
  status: CancelStatus;
  timestamp: string;
  providerError?: string;
};

// Internal cancel (admin-facing)
export type Cancel = CancelPublic & {
  userUid: string;
  providerUid: string;
  providerOrderId: number;
  orderUid: string;
};
