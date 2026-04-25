import { Metadata } from "next";
import { OrderDetailClient } from "./components/OrderDetailClient";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View order details",
};

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}
