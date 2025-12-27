import { ComingSoon } from "@/components/ComingSoon";
import Statistics from "./components/statistics";
import { TypographyH2 } from "@/components/typography";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <TypographyH2 className="mb-0">Analytics & Reports</TypographyH2>
      </div>
      <ComingSoon
        title="Analytics Feature Coming Soon"
        description="Stay tuned this feature will be created soon!"
      />
    </main>
  );
}
