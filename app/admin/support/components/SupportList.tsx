"use client";

import { useEffect, useState } from "react";
import { SupportTicket } from "@/types";
import SupportToolbar from "./SupportToolbar";
import SupportTableView from "./SupportTableView";
import SupportCardView from "./SupportCardView";
import { useGetSupportTicket } from "@/hooks/use-support";
import Loading from "@/app/loading";
import { EmptyState } from "@/components/empty-state";
import { MessageCircle } from "lucide-react";

export default function SupportList() {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: ticketsData, isLoading } = useGetSupportTicket();

  useEffect(() => {
    if (ticketsData) {
      setTickets(tickets);
    }
  }, [ticketsData]);

  if (isLoading) {
    return <Loading />;
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No Ticket Found"
        description="No ticket have been created yet."
      />
    );
  }

  const filteredTickets: SupportTicket[] = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedTickets(checked ? filteredTickets.map((t) => String(t.id)) : []);
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    setSelectedTickets((prev) =>
      checked ? [...prev, ticketId] : prev.filter((id) => id !== ticketId)
    );
  };

  return (
    <div className="w-full space-y-6 p-6">
      <SupportToolbar
        selectedTickets={selectedTickets}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Responsive layouts */}
      <div className="hidden md:block">
        <SupportTableView
          tickets={filteredTickets}
          selectedTickets={selectedTickets}
          onSelectAll={handleSelectAll}
          onSelectTicket={handleSelectTicket}
        />
      </div>

      <div className="block md:hidden">
        <SupportCardView
          tickets={filteredTickets}
          selectedTickets={selectedTickets}
          onSelectTicket={handleSelectTicket}
        />
      </div>
    </div>
  );
}
