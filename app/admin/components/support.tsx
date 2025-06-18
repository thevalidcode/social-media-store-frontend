"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Trash2,
} from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  user: {
    name: string;
    email: string;
  };
  message: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    subject: "Unable to access my account",
    status: "open",
    user: {
      name: "John Smith",
      email: "john.smith@example.com",
    },
    message:
      "I've been trying to log into my account for the past 2 days but keep getting an error message. Can you please help me reset my password?",
    createdAt: "2024-01-15T10:30:00Z",
    priority: "high",
  },
  {
    id: "TKT-002",
    subject: "Billing inquiry about recent charge",
    status: "in-progress",
    user: {
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
    },
    message:
      "I noticed an unexpected charge on my account for $99.99. Could you please explain what this charge is for?",
    createdAt: "2024-01-14T14:22:00Z",
    priority: "medium",
  },
  {
    id: "TKT-003",
    subject: "Feature request: Dark mode",
    status: "open",
    user: {
      name: "Mike Chen",
      email: "mike.chen@tech.io",
    },
    message:
      "Would it be possible to add a dark mode option to the dashboard? It would be great for users who work late hours.",
    createdAt: "2024-01-13T09:15:00Z",
    priority: "low",
  },
  {
    id: "TKT-004",
    subject: "Data export not working",
    status: "resolved",
    user: {
      name: "Emily Davis",
      email: "emily.davis@startup.com",
    },
    message:
      "When I try to export my data as CSV, the download fails. I've tried multiple browsers with the same result.",
    createdAt: "2024-01-12T16:45:00Z",
    priority: "high",
  },
  {
    id: "TKT-005",
    subject: "Integration with third-party API",
    status: "closed",
    user: {
      name: "Robert Wilson",
      email: "r.wilson@enterprise.com",
    },
    message:
      "We need help setting up the integration with our CRM system. The documentation seems outdated.",
    createdAt: "2024-01-11T11:20:00Z",
    priority: "medium",
  },
];

export default function AdminSupportTable() {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bulkAction, setBulkAction] = useState("");

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(filteredTickets.map((ticket) => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "destructive",
      "in-progress": "default",
      resolved: "secondary",
      closed: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.replace("-", " ")}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "text-destructive",
      medium: "text-warning",
      low: "text-success",
    } as const;

    return colors[priority as keyof typeof colors] || "text-muted-foreground";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full space-y-4 p-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Mark as Read" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mark-read">Mark as Read</SelectItem>
              <SelectItem value="mark-unread">Mark as Unread</SelectItem>
              <SelectItem value="resolve">Resolve</SelectItem>
              <SelectItem value="close">Close</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button disabled={selectedTickets.length === 0}>Apply</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedTickets.length === filteredTickets.length &&
                    filteredTickets.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTickets.includes(ticket.id)}
                    onCheckedChange={(checked) =>
                      handleSelectTicket(ticket.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium truncate">{ticket.subject}</div>
                    <div className="text-sm text-muted-foreground truncate mt-1">
                      {ticket.message}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{ticket.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium capitalize ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(ticket.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filteredTickets.length} of {mockTickets.length} tickets
          {selectedTickets.length > 0 &&
            ` • ${selectedTickets.length} selected`}
        </div>
        <div>
          {filteredTickets.length === 0 &&
            searchQuery &&
            "No tickets match your search"}
        </div>
      </div>
    </div>
  );
}
