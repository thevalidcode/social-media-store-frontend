"use client";

import { useState } from "react";
import PaymentMethodsTable from "./components/PaymentMethodTable";
import PaymentMethodsCardView from "./components/PaymentMethodCard";
import PaymentToolbar from "./components/PaymentToolbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaymentGateway } from "@/types";

const dummyGateways: PaymentGateway[] = [
  {
    id: "1",
    name: "Paystack",
    platform: "Paystack",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968885.png",
    description: "Secure payments via Paystack",
    publicKey: "pk_test_xxxxxx",
    secretKey: "sk_test_xxxxxx",
    webhookUrl: "https://validplug.com/api/payments/paystack",
    status: "active",
  },
  {
    id: "2",
    name: "Flutterwave",
    platform: "Flutterwave",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968839.png",
    description: "Fast and reliable payment gateway",
    publicKey: "pk_live_xxxxxx",
    secretKey: "sk_live_xxxxxx",
    webhookUrl: "https://validplug.com/api/payments/flutterwave",
    status: "inactive",
  },
  {
    id: "3",
    name: "Bank Transfer",
    platform: "Manual",
    icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    description: "Accept transfers to your business account",
    publicKey: "",
    secretKey: "",
    webhookUrl: "",
    status: "active",
  },
];

export default function PaymentMethodsPage() {
  const [gateways, setGateways] = useState(dummyGateways);
  const isMobile = useIsMobile();

  return (
    <div className="p-6 space-y-6">
      <PaymentToolbar gateways={gateways} setGateways={setGateways} />
      {!isMobile ? (
        <PaymentMethodsTable gateways={gateways} setGateways={setGateways} />
      ) : (
        <PaymentMethodsCardView gateways={gateways} setGateways={setGateways} />
      )}
    </div>
  );
}
