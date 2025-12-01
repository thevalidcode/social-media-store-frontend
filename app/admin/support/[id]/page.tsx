"use client";

import { useParams, useRouter } from "next/navigation";
import SupportDetails from "../components/SupportDetails";
import { SupportTicket } from "@/types";
import { useEffect, useState } from "react";
import { useGetSupportTicket } from "@/hooks/use-support";
import Loading from "@/app/loading";
import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const { data: ticketsData, isLoading } = useGetSupportTicket();
  const router = useRouter();

  useEffect(() => {
    if (ticketsData) {
      setTickets(tickets);
    }
  }, [ticketsData]);

  if (isLoading) {
    return <Loading />;
  }

  const ticket = tickets.find((t) => t.id === Number(id));

  if (!ticket) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No Ticket Found"
        description="No ticket have been created yet."
      />
    );
  }

  return (
    <SupportDetails
      ticket={ticket}
      onClose={() => router.push("/admin/support")}
    />
  );
}
