"use client";

import { TypographyH2, TypographyP } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, DollarSign, Copy, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import ReferralCard from "./referralCard";

export default function ReferralComponent() {
  const referralLink = "https://validplug.com.ng/referral";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard", {
      position: "top-center",
      richColors: true,
    });
  };

  // Mock data - replace with actual data from your API
  const referralStats = {
    totalReferrals: 12,
    totalEarnings: 2450.75,
    activeReferrals: 8,
    monthlyEarnings: 450.25,
  };

  return (
    <div className=" space-y-6">
      {/* Main Referral Card */}
      <Card className="w-full max-w-4xl mx-auto shadow-none">
        <CardHeader className="text-center">
          <TypographyH2>
            <TrendingUp className="h-6 w-6" />
            Join Our Affiliate Program
          </TypographyH2>
          <TypographyP>
            Earn 10% commission for every order placed by your referral. Start
            earning today!
          </TypographyP>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Referral Link Section */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Your Referral Link</p>
              <p className="text-sm text-muted-foreground font-mono break-all">
                {referralLink}
              </p>
            </div>
            <Button
              onClick={() => copyToClipboard(referralLink)}
              className="shrink-0"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReferralCard
              icon={<Users className="h-5 w-5" />}
              title="Total Referrals"
              value={referralStats.totalReferrals}
            />
            <ReferralCard
              icon={<DollarSign className="h-5 w-5" />}
              title="Total Earnings"
              value={referralStats.totalEarnings}
              valueFormatter={(val) => `$${val.toFixed(2)}`}
            />
            <ReferralCard
              icon={<Users className="h-5 w-5" />}
              title="Active Referrals"
              value={referralStats.activeReferrals}
            />
            <ReferralCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="This Month"
              value={referralStats.monthlyEarnings}
              valueFormatter={(val) => `$${val.toFixed(2)}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
