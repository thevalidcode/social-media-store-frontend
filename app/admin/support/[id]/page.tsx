"use client";

import { useParams, useRouter } from "next/navigation";
import { mockTickets } from "@/app/_docs/doc";
import SupportDetails from "../components/SupportDetails";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const ticket = mockTickets.find((t) => String(t.id) === String(id));

  if (!ticket) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Ticket not found.</p>
      </div>
    );
  }

  return (
    <SupportDetails
      ticket={ticket}
      onClose={() => router.push("/admin/support")}
    />
  );
}
