import type { Metadata } from "next";

import { AdminOrderDetailClient } from "./components/AdminOrderDetailClient";

export const metadata: Metadata = {
  title: "Admin Order Detail",
  description: "Review and update order details",
};

export default function AdminOrderDetailPage() {
  return <AdminOrderDetailClient />;
}
