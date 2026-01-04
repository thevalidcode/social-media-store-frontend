"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import PaymentMethodForm from "./PaymentMethodForm";
import React, { useState } from "react";
import { PaymentGateway } from "@/types";
import { useCreatePaymentGateway } from "@/hooks/use-paymentGateway";
import { FeatureGate } from "@/components/FeatureGate";

export default function PaymentToolbar({
  gateways,
  openForm,
  setOpenForm,
  canAddMoreGateways,
  maxPaymentGateways,
  onAddClick,
}: {
  gateways: PaymentGateway[];
  setGateways: React.Dispatch<React.SetStateAction<PaymentGateway[]>>;
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  canAddMoreGateways: boolean;
  maxPaymentGateways: number;
  onAddClick: () => void;
}) {
  const [search, setSearch] = useState("");
  const { mutateAsync: addGateway } = useCreatePaymentGateway();
  const handleAddClick = () => {
    if (!canAddMoreGateways) return;
    onAddClick();
  };

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
          <FeatureGate
            isAllowed={canAddMoreGateways}
            featureLabel="Payment gateway limit"
            variant="tooltip"
            description={`You've reached the maximum of ${maxPaymentGateways} payment gateways. Upgrade to add more.`}
          >
            <Button onClick={handleAddClick}>
              <Plus className="w-4 h-4 mr-2" /> Add Gateway
            </Button>
          </FeatureGate>
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
