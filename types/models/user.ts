export type User = {
  id: number;
  uid?: string;
  username: string;
  email: string;
  image?: string | null;
  role?: "user" | "admin";
  status: "active" | "offline" | "away" | "banned";
  balance: number;
  spent: number;
  timestamp?: string;
  lastSeen?: string;
  currency?: string;
};