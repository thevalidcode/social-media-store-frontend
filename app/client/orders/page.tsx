import { OrdersTab } from "./components/OrderTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
  description: "Orders",
};

export default function OrdersPage() {
  return <OrdersTab />;
}
