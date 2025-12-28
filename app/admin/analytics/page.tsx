import { ComingSoon } from "@/components/ComingSoon";
import Statistics from "./components/statistics";
import { TypographyH2 } from "@/components/typography";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <main className="p-6 space-y-6">
      <ComingSoon
        title="Analytics Feature Coming Soon"
        description="Stay tuned this feature will be created soon!"
      />
    </main>
  );
}
