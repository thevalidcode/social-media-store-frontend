import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

function SupportDialog({
  isOpen,
  setIsOpen,
  handleCreateTicket,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleCreateTicket: (e: React.FormEvent) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input name="subject" placeholder="Subject" required />
          <Textarea
            name="message"
            placeholder="Describe your issue clearly"
            required
          />
          <Button type="submit" className="w-full">
            Submit Ticket
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SupportDialog;
