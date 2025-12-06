export type FaqStatus = "ACTIVE" | "DISABLED";

export interface Faq {
  storeScopedId: number;
  id: number;
  uid: string;
  question: string;
  answer: string;
  slug: string;
  status: FaqStatus;
  timestamp: string;
}
