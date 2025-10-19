export interface SupportTicket {
  id: number;
  subject: string;
  status: "open" | "closed" | "pending";
  lastUpdate: string;
  messages: { sender: "user" | "support"; text: string; time: string }[];
}

export interface SupportTicketAdmin {
  id: number;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  user: { name: string; email: string };
  message: string;
  createdAt: string;
  messages: { sender: "user" | "support"; text: string; time: string }[];
  priority: "low" | "medium" | "high";
}
