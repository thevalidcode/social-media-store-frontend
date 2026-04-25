"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Save, X } from "lucide-react";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { User } from "@/types";
import Decimal from "decimal.js";
import { UpdateUserByAdminProps } from "@/hooks/use-user";
import { currency } from "@/app/_docs/doc";
import { SelectWithSearch } from "@/components/ui/select-with-search";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (updatedUser: UpdateUserByAdminProps) => void;
}

export default function EditUserModal({
  open,
  onOpenChange,
  user,
  onSave,
}: EditUserModalProps) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    balance: "",
  });
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  const [balanceAction, setBalanceAction] = useState<"add" | "remove" | null>(
    null
  );
  const [balanceChange, setBalanceChange] = useState<number>(0);
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        balance: user.balance,
      });
      setSelectedCurrency(user.currency || "USD");
      setBalanceChange(0);
      setBalanceAction(null);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleCurrencyChange = (nextCurrency: string) => {
    if (nextCurrency === selectedCurrency) {
      return;
    }

    const convertedBalance = convert(
      selectedCurrency as any,
      nextCurrency as any,
      form.balance,
      true,
      false,
    ).amount;

    setForm((prev) => ({ ...prev, balance: convertedBalance }));
    setSelectedCurrency(nextCurrency);
    setBalanceChange(0);
    setBalanceAction(null);
  };

  const handleSave = () => {
    let newBalance = new Decimal(form.balance);
    if (balanceAction === "add")
      newBalance = newBalance.plus(balanceChange);
    if (balanceAction === "remove")
      newBalance = newBalance.minus(balanceChange);

    const updatedUser = {
      username: form.username,
      email: form.email,
      uid: user.uid,
      balance: newBalance.toString(),
      currency: selectedCurrency,
    };

    onSave(updatedUser);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setBalanceChange(0);
    setBalanceAction(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Edit User Account
          </DialogTitle>
          <DialogDescription>
            Update user profile details or adjust account balance.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value.trimStart() })
              }
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value.trim() })
              }
              placeholder="Enter email address"
            />
          </div>

          {/* Balance Section */}
          <div className="border rounded-2xl p-4 bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Current Balance ({selectedCurrency})</Label>
              <span className="text-lg font-medium text-primary">
                {
                  convert(
                    selectedCurrency as any,
                    userCurrency,
                    form.balance,
                    true,
                    true
                  ).formatted
                }
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={balanceAction === "add" ? "default" : "outline"}
                className={cn(
                  "flex-1 flex items-center gap-1",
                  balanceAction === "add" && "bg-green-600 hover:bg-green-700"
                )}
                onClick={() => setBalanceAction("add")}
              >
                <ArrowUp className="h-4 w-4" />
                Add
              </Button>
              <Button
                type="button"
                variant={balanceAction === "remove" ? "default" : "outline"}
                className={cn(
                  "flex-1 flex items-center gap-1",
                  balanceAction === "remove" &&
                    "bg-red-600 hover:bg-red-700 text-white"
                )}
                onClick={() => setBalanceAction("remove")}
              >
                <ArrowDown className="h-4 w-4" />
                Remove
              </Button>
            </div>

            <div className="space-y-1">
              <Label>Currency</Label>
              <SelectWithSearch
                value={selectedCurrency}
                onValueChange={handleCurrencyChange}
                placeholder="Select currency"
                searchPlaceholder="Search currency..."
                options={Object.entries(currency).map(([code, name]) => ({
                  value: code,
                  label: `${code} - ${name.split("|")[0]}`,
                }))}
                emptyMessage="No currency found"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Changing the currency converts the stored balance to the new currency before saving.
              </p>
            </div>

            {balanceAction && (
              <div className="space-y-1">
                <Label>
                  {balanceAction === "add"
                    ? "Amount to Add"
                    : "Amount to Remove"}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={balanceChange}
                  onChange={(e) =>
                    setBalanceChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder={`Enter amount in ${selectedCurrency}`}
                />
                <p className="text-xs text-muted-foreground">
                  Adjustments are applied directly in {selectedCurrency}.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-1 bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
