"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import SupportBadge from "./SupportBadge";
import SupportPriority from "./SupportPriority";
import SupportActionsMenu from "./SupportActionsMenu";
import Link from "next/link";
import { SupportTicket } from "@/types";

export default function SupportCardView({
  tickets,
  selectedTickets,
  onSelectTicket,
}: {
  tickets: SupportTicket[];
  selectedTickets: string[];
  onSelectTicket: (ticketId: string, checked: boolean) => void;
}) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="p-4 shadow-sm border rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedTickets.includes(String(ticket.id))}
                onCheckedChange={(checked) =>
                  onSelectTicket(String(ticket.id), checked as boolean)
                }
              />
              <div>
                <Link
                  href={`/admin/support/ticket?id=${ticket.id}`}
                  className="font-semibold hover:underline"
                >
                  {ticket.subject}
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {ticket.messages[0].message}
                </p>
              </div>
            </div>
            <SupportActionsMenu ticket={ticket} />
          </div>

          <CardContent className="p-0 mt-3 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <SupportBadge status={ticket.status} />
              <SupportPriority priority={ticket.priority} />
            </div>
            <div className="text-muted-foreground">
              {ticket.user.fullName} • {ticket.user.email}
            </div>
            <div className="text-muted-foreground">
              {formatDate(ticket.createdAt)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
