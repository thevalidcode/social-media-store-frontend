// src/types/models/supportTicket.ts

// Enums (match Prisma enum identifiers, NOT mapped DB values)
export type TicketStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type MessageSenderType = "USER" | "ADMIN";

/**
 * Message model (matches Prisma's TicketMessage)
 */
export interface TicketMessage {
  id: number;
  uid: string;
  ticketUid: string;
  senderUid: string;
  senderType: MessageSenderType;
  message: string;
  createdAt: string;
}

/**
 * Base Support Ticket model (internal use)
 */
export interface SupportTicket {
  id: number;
  uid: string;
  description?: string | null;
  storeId: number;
  userUid: string;
  storeScopedId: number;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

/**
 * Public-facing support ticket
 * (For users viewing their own tickets)
 */
export interface SupportTicketPublic
  extends Omit<SupportTicket, "storeId" | "userUid" | "messages"> {
  lastUpdate: string;
  messages: {
    senderType: MessageSenderType;
    message: string;
    createdAt: string;
  }[];
}
