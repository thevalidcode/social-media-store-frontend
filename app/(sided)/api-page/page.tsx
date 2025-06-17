import APISection from "@/app/(root)/components/APIPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "valid panel api",
  description: "API",
  keywords: ["api", "valid panel api", "valid panel", "api"],
};
export default function ApiPage() {
  return (
    <div>
      <APISection />
    </div>
  );
}
