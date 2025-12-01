"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import PaymentMethodForm from "./PaymentMethodForm";
import React, { useState } from "react";
import { PaymentGateway } from "@/types";
import {
  PaymentGatewayFormResponse,
  useCreatePaymentGateway,
  useUpdatePaymentGateway,
} from "@/hooks/use-paymentGateway";

export default function PaymentToolbar({
  gateways,
  openForm,
  setOpenForm,
}: {
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [search, setSearch] = useState("");
  const { mutateAsync: addGateway } = useCreatePaymentGateway();

  const createGateway = async (gateway: PaymentGateway) => {
    const response = await addGateway(gateway);
    setOpenForm(false);
    return response;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      {gateways.length !== 0 && (
        <React.Fragment>
          <Input
            placeholder="Search payment methods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setOpenForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Gateway
          </Button>
        </React.Fragment>
      )}

      <PaymentMethodForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={createGateway}
      />
    </div>
  );
}
