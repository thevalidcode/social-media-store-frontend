"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SupportTicketAdmin } from "@/types";
import SupportBadge from "./SupportBadge";
import SupportPriority from "./SupportPriority";
import SupportActionsMenu from "./SupportActionsMenu";
import Link from "next/link";

export default function SupportTableView({
  tickets,
  selectedTickets,
  onSelectAll,
  onSelectTicket,
}: {
  tickets: SupportTicketAdmin[];
  selectedTickets: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectTicket: (ticketId: string, checked: boolean) => void;
}) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedTickets.length === tickets.length && tickets.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                <Checkbox
                  checked={selectedTickets.includes(String(ticket.id))}
                  onCheckedChange={(checked) =>
                    onSelectTicket(String(ticket.id), checked as boolean)
                  }
                />
              </TableCell>
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell>
                <Link href={`/admin/support/${ticket.id}`} className="font-medium hover:underline">
                  {ticket.subject}
                </Link>
                <div className="text-sm text-muted-foreground truncate mt-1">
                  {ticket.message}
                </div>
              </TableCell>
              <TableCell>
                <SupportBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{ticket.user.name}</div>
                  <div className="text-sm text-muted-foreground">{ticket.user.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <SupportPriority priority={ticket.priority} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(ticket.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <SupportActionsMenu ticket={ticket} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
