"use client";

import { useEffect, useState } from "react";
import PaymentMethodsTable from "./components/PaymentMethodTable";
import PaymentMethodsCardView from "./components/PaymentMethodCard";
import PaymentToolbar from "./components/PaymentToolbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaymentGateway } from "@/types";
import { useGetAllPaymentGatewaysForAdmins } from "@/hooks/use-paymentGateway";
import { EmptyState } from "@/components/empty-state";
import { CreditCard } from "lucide-react";

export default function PaymentMethodsPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { data: gatewaysData } = useGetAllPaymentGatewaysForAdmins();

  useEffect(() => {
    if (gatewaysData) {
      setGateways(gatewaysData);
    }
  }, [gatewaysData]);

  if (gateways.length === 0) {
    return (
      <>
        <EmptyState
          icon={CreditCard}
          title="No Payment Method Found"
          description="No payment method have been created yet."
          actionLabel="Create Payment Method"
          onAction={() => setOpenForm(true)}
        />
        <PaymentToolbar
          openForm={openForm}
          setOpenForm={setOpenForm}
          gateways={gateways}
          setGateways={setGateways}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PaymentToolbar
        openForm={openForm}
        setOpenForm={setOpenForm}
        gateways={gateways}
        setGateways={setGateways}
      />
      {!isMobile ? (
        <PaymentMethodsTable gateways={gateways} setGateways={setGateways} />
      ) : (
        <PaymentMethodsCardView gateways={gateways} setGateways={setGateways} />
      )}
    </div>
  );
}
