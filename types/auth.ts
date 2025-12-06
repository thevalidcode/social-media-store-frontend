export interface SessionUser {
  id: number;
  uid: string;
  email: string;
  role: "user" | "admin";
  token: string;
}
