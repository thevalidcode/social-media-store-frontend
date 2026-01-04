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
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";

export default function PaymentMethodsPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { data: gatewaysData } = useGetAllPaymentGatewaysForAdmins();
  const { storeInfo } = useAppContext();

  const maxPaymentGateways = storeInfo?.features?.payment_gateways ?? 0;
  const canAddMoreGateways = gateways.length < maxPaymentGateways;

  const handleAddClick = () => {
    if (!canAddMoreGateways) {
      toast.error(
        `You can only add up to ${maxPaymentGateways} payment gateways. Upgrade your plan for more.`
      );
      return;
    }
    setOpenForm(true);
  };

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
          onAction={handleAddClick}
          maxAmount={maxPaymentGateways}
          canAddMore={canAddMoreGateways}
          featureLabel="Payment gateway limit"
          tooltipDescription={`You've reached the maximum of ${maxPaymentGateways} payment gateways. Upgrade to add more.`}
        />
        <PaymentToolbar
          openForm={openForm}
          setOpenForm={setOpenForm}
          gateways={gateways}
          setGateways={setGateways}
          canAddMoreGateways={canAddMoreGateways}
          maxPaymentGateways={maxPaymentGateways}
          onAddClick={handleAddClick}
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
        canAddMoreGateways={canAddMoreGateways}
        maxPaymentGateways={maxPaymentGateways}
        onAddClick={handleAddClick}
      />
      {!isMobile ? (
        <PaymentMethodsTable gateways={gateways} setGateways={setGateways} />
      ) : (
        <PaymentMethodsCardView gateways={gateways} setGateways={setGateways} />
      )}
    </div>
  );
}
