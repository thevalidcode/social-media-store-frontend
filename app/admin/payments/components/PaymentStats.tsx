"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Payment } from "@/types";
import { useMemo } from "react";
import { useAppContext } from "@/context/appContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";

interface PaymentStatsProps {
  payments: Payment[];
}

type AmountCurrency = { amount: number; currency: string };

interface Stats {
  totalAmount: AmountCurrency;
  totalPayments: number;
  pendingCount: number;
  successRate: number;
}

export function PaymentStats({ payments }: PaymentStatsProps) {
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();

  const stats = useMemo<Stats>(() => {
    if (!payments || payments.length === 0) {
      return {
        totalAmount: { amount: 0, currency: "USD" },
        totalPayments: 0,
        pendingCount: 0,
        successRate: 0,
      };
    }

    const totalAmount = payments.reduce((sum, p) => {
      const converted = convert(p.currency, "USD", p.chargedAmount);
      const amt =
        typeof converted.amount === "string"
          ? parseFloat(converted.amount)
          : Number(converted.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const totalPayments = payments.length;
    const pendingCount = payments.filter((p) => p.status === "PENDING").length;
    const successCount = payments.filter((p) => p.status === "SUCCESS").length;
    const successRate =
      totalPayments > 0 ? (successCount / totalPayments) * 100 : 0;

    return {
      totalAmount: { amount: totalAmount, currency: "USD" },
      totalPayments,
      pendingCount,
      successRate,
    };
  }, [payments, convert]);

  const statCards = [
    {
      title: "Total Payments",
      value: stats.totalPayments.toLocaleString(),
      description: "All time payment count",
      icon: Wallet,
      delay: 0.1,
    },
    {
      title: "Total Amount",
      value: convert(
        stats.totalAmount.currency as any,
        userCurrency,
        stats.totalAmount.amount,
        true,
        false
      ).formatted,
      description: "Total revenue generated",
      icon: DollarSign,
      delay: 0.2,
    },
    {
      title: "Pending Payments",
      value: stats.pendingCount.toString(),
      description: "Awaiting confirmation",
      icon: Clock,
      delay: 0.3,
    },
    {
      title: "Success Rate",
      value: `${stats.successRate.toFixed(1)}%`,
      description: "Payment success ratio",
      icon: TrendingUp,
      delay: 0.4,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
