export type PageType =
  | "SERVICES"
  | "ORDERS"
  | "ORDER"
  | "TERMS_OF_SERVICE"
  | "PRIVACY_POLICY";

export type PageStatus = "ACTIVE" | "INACTIVE";

export interface Page {
  uid: string;
  id: number;
  storeScopedId: number;
  pageType: PageType;
  title: string;
  content: string;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
}
