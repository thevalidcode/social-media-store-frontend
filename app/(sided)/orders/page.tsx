import { OrdersTab } from "../component/tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
  description: "Orders",
  keywords: ["orders", "crop studio", "crop", "studio"],
};

export default function OrdersPage() {
  return <OrdersTab />;
}
