import APISection from "@/app/(root)/components/APIPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media Store API",
  description: "API",
  keywords: ["api", "social media store api", "stores", "api"],
};
export default function ApiPage() {
  return (
    <div>
      <APISection />
    </div>
  );
}
