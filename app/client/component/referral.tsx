"use client";

import React from "react";
import { motion } from "framer-motion";
import { TypographyH2, TypographyP } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, DollarSign, Copy, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import GridCard from "./referralCard";

export default function ReferralComponent() {
  const referralLink = "https://validplug.com.ng/referral";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Referral link copied successfully");
  };

  const referralStats = {
    totalReferrals: 12,
    totalEarnings: 2450.75,
    activeReferrals: 8,
    monthlyEarnings: 450.25,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 w-full max-w-5xl mx-auto"
    >
      {/* Main Referral Card */}
      <Card className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="text-center space-y-3 pt-8">
          <div className="flex justify-center items-center gap-2 text-primary">
            <TrendingUp className="h-6 w-6" />
            <TypographyH2>Join Our Affiliate Program</TypographyH2>
          </div>
          <TypographyP className="text-sm text-muted-foreground max-w-xl mx-auto">
            Earn <strong>10% commission</strong> for every order placed by your
            referrals. Share your link and start earning instantly.
          </TypographyP>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Referral Link Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 p-4 border rounded-xl bg-muted/40"
          >
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Your Referral Link</p>
              <p className="text-sm text-muted-foreground font-mono break-all">
                {referralLink}
              </p>
            </div>
            <Button
              onClick={() => copyToClipboard(referralLink)}
              size="sm"
              variant="default"
              className="sm:w-auto w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <GridCard
              icon={<Users className="h-5 w-5 text-primary" />}
              title="Total Referrals"
              value={referralStats.totalReferrals}
            />
            <GridCard
              icon={<DollarSign className="h-5 w-5 text-primary" />}
              title="Total Earnings"
              value={referralStats.totalEarnings}
              valueFormatter={(v) => `$${v.toFixed(2)}`}
            />
            <GridCard
              icon={<Users className="h-5 w-5 text-primary" />}
              title="Active Referrals"
              value={referralStats.activeReferrals}
            />
            <GridCard
              icon={<TrendingUp className="h-5 w-5 text-primary" />}
              title="This Month"
              value={referralStats.monthlyEarnings}
              valueFormatter={(v) => `$${v.toFixed(2)}`}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
