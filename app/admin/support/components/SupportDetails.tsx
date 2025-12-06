"use client";

import { useEffect, useState } from "react";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSenderType, SupportTicket } from "@/types/models/support";
import {
  useCreateSupportMessage,
  useGetSupportTicketByUid,
} from "@/hooks/use-support";
import { useAppContext } from "@/context/appContext";
import Loading from "@/app/loading";

interface Props {
  ticket: SupportTicket;
  onClose: () => void;
}

export default function TicketDetails({ ticket, onClose }: Props) {
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState(ticket.messages);
  const { mutate: sendMessage } = useCreateSupportMessage(ticket.uid);
  const { adminInfo } = useAppContext();
  const { data: ticketData, isLoading } = useGetSupportTicketByUid(ticket.uid);

  useEffect(() => {
    if (ticketData) {
      setMessages(ticketData.messages);
    }
  }, [ticketData]);

  if (isLoading) {
    return <Loading />;
  }

  const handleReply = () => {
    if (!reply.trim()) return;
    const newMsg = {
      senderType: "ADMIN" as MessageSenderType,
      message: reply,
      createdAt: new Date(),
      ticketUid: ticket.uid,
      senderUid: adminInfo?.uid,
    };
    sendMessage(newMsg);
    setReply("");
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      className="border rounded-xl h-[70vh] flex flex-col"
    >
      <CardHeader className="border-b flex justify-between items-center">
        <h2 className="font-semibold">{ticket.subject}</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.senderType === "ADMIN" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                msg.senderType === "ADMIN"
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-[10px] opacity-70 block mt-1 text-right">
                {msg.createdAt}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="border-t p-3 flex gap-2">
        <Input
          placeholder="Type your reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleReply()}
        />
        <Button onClick={handleReply}>Send</Button>
      </div>
    </motion.div>
  );
}
