import { TypographyH1 } from "@/components/typography";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin",
  description: "Admin page",
};

export default function AdminPage() {
  return (
    <div>
      <TypographyH1>this is the admin page</TypographyH1>
    </div>
  );
}
