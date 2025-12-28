"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { EmptyState } from "@/components/empty-state";
import Loading from "@/app/loading";

import {
  useCreateSupportTicket,
  useCreateUserSupportMessage,
  useGetUserSupportTicket,
} from "@/hooks/use-support";
import { SupportTicketPublic } from "@/types";
import SupportDialog from "./components/SupportDialog";

function formatTime(date: string) {
  return new Date(date).toLocaleString();
}

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] =
    useState<SupportTicketPublic | null>(null);
  const [reply, setReply] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: tickets, isLoading } = useGetUserSupportTicket();
  const { mutate: createTicket } = useCreateSupportTicket();
  const { mutate: sendReply } = useCreateUserSupportMessage(
    selectedTicket?.uid || ""
  );

  if (isLoading) return <Loading />;

  /* ---------- EMPTY STATE ---------- */
  if (!tickets || tickets.length === 0) {
    return (
      <>
        <SupportDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleCreateTicket={handleCreateTicket}
        />
        <EmptyState
          icon={MessageSquarePlus}
          title="No support tickets yet"
          description="Create a ticket and our support team will respond shortly."
          actionLabel="Create Ticket"
          onAction={() => setIsOpen(true)}
        />
      </>
    );
  }

  /* ---------- HANDLERS ---------- */
  function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const subject = (form.subject as HTMLInputElement).value;
    const message = (form.message as HTMLTextAreaElement).value;

    createTicket({ subject, message });
    form.reset();
    setIsOpen(false);
  }

  function handleSendReply() {
    if (!reply.trim() || !selectedTicket) return;

    sendReply({ message: reply });

    setSelectedTicket({
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          senderType: "USER",
          message: reply,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    setReply("");
  }

  /* ---------- UI ---------- */
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Support</h1>

        {/* Create ticket ONLY if tickets exist */}
        <Button onClick={() => setIsOpen(true)}>Create Ticket</Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`cursor-pointer transition ${
                selectedTicket?.id === ticket.id
                  ? "ring-2 ring-primary"
                  : "hover:bg-muted"
              }`}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{ticket.subject}</h3>
                  <Badge
                    variant={
                      ticket.status === "OPEN"
                        ? "default"
                        : ticket.status === "PENDING"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {ticket.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conversation */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedTicket ? (
              <motion.div
                key={selectedTicket.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="flex flex-col h-[70vh]">
                  <CardHeader className="border-b">
                    <h2 className="font-semibold">{selectedTicket.subject}</h2>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedTicket.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.senderType === "USER"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 text-sm ${
                            msg.senderType === "USER"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <span className="block text-[10px] opacity-70 mt-1 text-right">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {/* Reply */}
                  <div className="border-t p-3 flex gap-2">
                    <Input
                      placeholder="Write a reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                    />
                    <Button onClick={handleSendReply}>Send</Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="h-[70vh] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Select a ticket to view the conversation
                </p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <SupportDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleCreateTicket={handleCreateTicket}
      />
    </div>
  );
}
