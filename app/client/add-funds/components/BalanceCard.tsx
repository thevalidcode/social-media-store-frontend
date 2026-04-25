"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, RefreshCcw, BadgeCheck } from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { useGetUserByUid } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";

export function BalanceCard() {
  const { userCurrency, userInfo } = useAppContext();
  const convert = useCurrencyConverter();
  const { data: liveUser } = useGetUserByUid(userInfo?.uid || "");

  const account = liveUser || userInfo;
  const balance = Number(account?.balance || 0);
  const spent = Number(account?.spent || 0);
  const walletCurrency = account?.currency || userCurrency;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-primary/10 via-background to-background shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                Wallet balance
              </div>
              <div className="text-3xl font-semibold tracking-tight md:text-4xl">
                {convert(walletCurrency, userCurrency, balance, true, false).formatted}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="gap-1">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Live balance
                </Badge>
                <span>Stored in {walletCurrency}</span>
              </div>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Current account
              </div>
              <div className="mt-2 text-sm font-medium">
                {account?.username || account?.email || "Wallet account"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Refreshes automatically after a successful top-up.
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Lifetime spend
              </div>
              <div className="mt-2 text-sm font-medium">
                {convert(walletCurrency, userCurrency, spent, true, false).formatted}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <RefreshCcw className="h-3.5 w-3.5" />
                Top up to keep checkout instant.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
