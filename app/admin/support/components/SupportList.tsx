"use client";

import { useState } from "react";
import { mockTickets } from "@/app/_docs/doc";
import { SupportTicketAdmin } from "@/types";
import SupportToolbar from "./SupportToolbar";
import SupportTableView from "./SupportTableView";
import SupportCardView from "./SupportCardView";

export default function SupportList() {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTickets: SupportTicketAdmin[] = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
