"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp } from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

export function BalanceCard() {
  const { userCurrency, userInfo } = useAppContext();
  const convert = useCurrencyConverter();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-2 bg-gradient-to-br from-primary/5 via-primary/3 to-background">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Available Balance
              </p>
              <p className="text-3xl md:text-4xl font-bold">
                {
                  convert(
                    "USD",
                    userCurrency,
                    userInfo?.balance!,
                    true,
                    false
                  ).formatted
                }
              </p>
            </div>
            <div className="p-4 rounded-full bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
