"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  feePercent: number;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bank",
    name: "Bank Transfer",
    icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    feePercent: 0,
  },
  {
    id: "card",
    name: "Debit/Credit Card",
    icon: "https://cdn-icons-png.flaticon.com/512/217/217425.png",
    feePercent: 2.5,
  },
  {
    id: "crypto",
    name: "Crypto (USDT)",
    icon: "https://cdn-icons-png.flaticon.com/512/825/825454.png",
    feePercent: 1.5,
  },
];

export default function AddFunds() {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>("bank");
  const [balance, setBalance] = useState<number>(6500);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === method)!;
  const fee = (amount * selectedMethod.feePercent) / 100;
  const total = amount + fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert("Enter a valid amount");
    console.log({
      method,
      amount,
      fee,
      total,
    });
    alert(`You’re adding ₦${total.toLocaleString()} via ${selectedMethod.name}`);
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <motion.section
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold">Add Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Balance Summary */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-xl font-semibold text-green-600">
                ₦{balance.toLocaleString()}
              </p>
            </div>

            {/* Amount Input */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="amount">Enter Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="100"
                  placeholder="e.g. 5000"
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <Separator />

              {/* Payment Methods */}
              <div className="space-y-3">
                <Label>Select Payment Method</Label>
                <RadioGroup
                  value={method}
                  onValueChange={setMethod}
                  className="grid sm:grid-cols-3 gap-4"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <Label
                      key={m.id}
                      htmlFor={m.id}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                        method === m.id ? "border-primary" : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem id={m.id} value={m.id} className="sr-only" />
                      <img
                        src={m.icon}
                        alt={m.name}
                        className="w-10 h-10 object-contain"
                      />
                      <span className="font-medium text-sm text-center">{m.name}</span>
                      <span className="text-xs text-gray-500">
                        Fee: {m.feePercent}%
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Amount</span>
                  <span>₦{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Fee ({selectedMethod.feePercent}%)</span>
                  <span>₦{fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <span>Total</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={amount <= 0}>
                  Add ₦{total > 0 ? total.toLocaleString() : "0"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}
