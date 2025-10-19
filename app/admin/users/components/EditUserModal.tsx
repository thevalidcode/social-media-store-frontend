"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Save, X } from "lucide-react";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onSave: (updatedUser: any) => void;
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
    balance: 0,
  });

  const [balanceAction, setBalanceAction] = useState<"add" | "remove" | null>(
    null
  );
  const [balanceChange, setBalanceChange] = useState<number>(0);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        balance: user.balance,
      });
      setBalanceChange(0);
      setBalanceAction(null);
    }
  }, [user]);

  const handleSave = () => {
    let newBalance = form.balance;
    if (balanceAction === "add") newBalance += balanceChange;
    if (balanceAction === "remove") newBalance -= balanceChange;

    const updatedUser = {
      ...user,
      username: form.username,
      email: form.email,
      balance: newBalance < 0 ? 0 : newBalance,
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit User Account
          </DialogTitle>
          <DialogDescription>
            Update user profile details or adjust account balance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
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
              <Label>Current Balance</Label>
              <span className="text-lg font-medium text-primary">
                ₦{form.balance.toLocaleString()}
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
                  placeholder="Enter amount"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
