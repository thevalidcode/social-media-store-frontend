"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import PaymentMethodForm from "./PaymentMethodForm";
import { useState } from "react";
import { PaymentGateway } from "@/types";
import { Button } from "@/components/ui/button";

export default function PaymentMethodActions({
  gateway,
  setGateways,
}: {
  gateway: PaymentGateway;
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = () => {
    setGateways((prev) => prev.filter((g) => g.id !== gateway.id));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash className="w-4 h-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PaymentMethodForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={gateway}
        onSave={(updated) => {
          setGateways((prev) =>
            prev.map((g) => (g.id === gateway.id ? updated : g))
          );
          setEditOpen(false);
        }}
      />
    </>
  );
}
