"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import PaymentMethodForm from "./PaymentMethodForm";
import { useState } from "react";
import { PaymentGateway } from "@/types";

export default function PaymentToolbar({
  gateways,
  setGateways,
}: {
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
}) {
  const [openForm, setOpenForm] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <Input
        placeholder="Search payment methods..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <Button onClick={() => setOpenForm(true)}>
        <Plus className="w-4 h-4 mr-2" /> Add Gateway
      </Button>

      <PaymentMethodForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={(newGateway) => {
          setGateways((prev) => [...prev, newGateway]);
          setOpenForm(false);
        }}
      />
    </div>
  );
}
