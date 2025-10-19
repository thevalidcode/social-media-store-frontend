"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, PlusCircle } from "lucide-react";
import { SupportTicket } from "@/types";

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 1,
      subject: "Payment not reflecting",
      status: "open",
      lastUpdate: "2025-10-10",
      messages: [
        {
          sender: "user",
          text: "I made a payment but it’s not showing yet.",
          time: "10:00 AM",
        },
        {
          sender: "support",
          text: "We’re checking this for you.",
          time: "10:05 AM",
        },
      ],
    },
    {
      id: 2,
      subject: "Order delay issue",
      status: "pending",
      lastUpdate: "2025-10-09",
      messages: [
        {
          sender: "user",
          text: "My order has been pending for hours.",
          time: "8:00 AM",
        },
        {
          sender: "support",
          text: "Please share your order ID.",
          time: "8:10 AM",
        },
      ],
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [reply, setReply] = useState("");

  const handleSendReply = () => {
    if (!reply.trim() || !selectedTicket) return;

    const newMessage = {
      sender: "user" as const,
      text: reply,
      time: new Date().toLocaleTimeString(),
    };

    const updatedTickets: SupportTicket[] = tickets.map((t) =>
      t.id === selectedTicket.id
        ? { ...t, messages: [...t.messages, newMessage] }
        : t
    );

    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
    });
    setReply("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" /> Support Center
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const newTicket: SupportTicket = {
                  id: Date.now(),
                  subject: (e.target as any).subject.value,
                  status: "open",
                  lastUpdate: new Date().toISOString().split("T")[0],
                  messages: [
                    {
                      sender: "user",
                      text: (e.target as any).message.value,
                      time: new Date().toLocaleTimeString(),
                    },
                  ],
                };
                setTickets([newTicket, ...tickets]);
                (e.target as any).reset();
              }}
            >
              <Input name="subject" placeholder="Subject" required />
              <Textarea
                name="message"
                placeholder="Describe your issue..."
                required
              />
              <Button type="submit" className="w-full">
                Submit Ticket
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket List */}
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              layout
              className={`p-4 border rounded-xl cursor-pointer hover:scale-[1.02] transition-transform ${
                selectedTicket?.id === ticket.id ? "ring-2" : ""
              }`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{ticket.subject}</h3>
                <Badge
                  variant={
                    ticket.status === "open"
                      ? "default"
                      : ticket.status === "pending"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {ticket.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Last update: {ticket.lastUpdate}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Ticket Messages */}
        <AnimatePresence mode="wait">
          {selectedTicket && (
            <motion.div
              key={selectedTicket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="border rounded-xl flex flex-col h-[70dvh]"
            >
              <CardHeader className="border-b">
                <h2 className="font-semibold">{selectedTicket.subject}</h2>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-3 p-4">
                {selectedTicket.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[10px] opacity-70 block mt-1 text-right">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Reply box */}
              <div className="border-t p-3 flex gap-2">
                <Input
                  placeholder="Type your reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                />
                <Button onClick={handleSendReply}>Send</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
