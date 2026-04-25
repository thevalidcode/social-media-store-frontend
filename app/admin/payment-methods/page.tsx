"use client";

import { useEffect, useMemo, useState } from "react";
import PaymentToolbar from "./components/PaymentToolbar";
import { PaymentMethodsHeader } from "./components/PaymentMethodsHeader";
import { PaymentMethodStats } from "./components/PaymentMethodStats";
import { PaymentMethodCardList } from "./components/PaymentMethodCardList";
import { PaymentGateway } from "@/types";
import { useGetAllPaymentGatewaysForAdmins } from "@/hooks/use-paymentGateway";
import { EmptyState } from "@/components/empty-state";
import { CreditCard } from "lucide-react";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";

export default function PaymentMethodsPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
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
      setGateways(gatewaysData.filter((gateway) => gateway.platform !== "CREDIT"));
    }
  }, [gatewaysData]);

  const filteredGateways = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return gateways.filter((gateway) => {
      const matchesStatus = status === "ALL" ? true : gateway.status === status;

      if (!normalizedSearch) {
        return matchesStatus;
      }

      const plainDescription = (gateway.description || "").toLowerCase();
      const contentText = (gateway.content || "").toLowerCase();

      const matchesSearch =
        gateway.name.toLowerCase().includes(normalizedSearch) ||
        gateway.platform.toLowerCase().includes(normalizedSearch) ||
        plainDescription.includes(normalizedSearch) ||
        contentText.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [gateways, search, status]);

  if (gateways.length === 0) {
    return (
      <div className="space-y-6">
        <PaymentMethodsHeader
          onCreateClick={handleAddClick}
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          canAddMoreGateways={canAddMoreGateways}
        />

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PaymentMethodsHeader
        onCreateClick={handleAddClick}
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        canAddMoreGateways={canAddMoreGateways}
      />

      <PaymentMethodStats gateways={gateways} />

      <PaymentToolbar
        openForm={openForm}
        setOpenForm={setOpenForm}
        gateways={gateways}
        setGateways={setGateways}
        canAddMoreGateways={canAddMoreGateways}
        maxPaymentGateways={maxPaymentGateways}
        onAddClick={handleAddClick}
      />

      <PaymentMethodCardList
        gateways={filteredGateways}
        setGateways={setGateways}
      />
    </div>
  );
}
