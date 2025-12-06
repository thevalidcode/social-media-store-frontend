"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import CurrencySelect from "@/components/CurrencySelect";
import { useAppContext } from "@/context/appContext";
import { useUpdateUser } from "@/hooks/use-user";
import { useUploadImage } from "@/hooks/use-file";
import { useCurrencyConverter } from "@/lib/currencyConverter";

export default function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  const { userCurrency, userInfo, setUserInfo } = useAppContext();
  const [showApiKey, setShowApiKey] = useState(false);
  const [btnApiKeyVisible, setBtnApiKeyVisible] = useState(false);
  const { mutate } = useUpdateUser();

  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: uploadImage } = useUploadImage();

  const convert = useCurrencyConverter();

  if (!userInfo) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo!, [name]: value });
  }

  function regenerateApiKey() {
    const newKey =
      "sk_live_" +
      Math.random().toString(36).substring(2, 20) +
      Date.now().toString(36);
    setUserInfo({ ...userInfo!, apiKey: newKey });
    setBtnApiKeyVisible(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({
      ...userInfo!,
      fullName: userInfo?.fullName ?? "",
      image: userInfo?.image ?? undefined,
    });
    setEditing(false);
  }

  const maskedKey =
    userInfo?.apiKey && userInfo.apiKey.length > 10
      ? userInfo.apiKey.slice(0, 8) + "********"
      : "********";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    const response = await uploadImage({ file: file!, collection: "users" });
    await updateUser({ image: response.url });
    setUserInfo({ ...userInfo!, image: response.url });
  };

  return (
    <main className="min-h-screen w-full p-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl mx-auto"
      >
        <Card className="p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="relative w-32 h-32">
              <img
                src={userInfo?.image ?? "/images/default-profile.jpg"}
                alt={userInfo.fullName ?? "Admin Profile"}
                className="w-32 h-32 rounded-full object-cover border border-primary/40"
              />

              {editing && (
                <label
                  htmlFor="profile-upload"
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <span className="text-white flex flex-col items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M9 13l6 6 6-6-6-6-6 6z"
                      />
                    </svg>
                    <span className="text-xs">Edit</span>
                  </span>
                  <Input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload} // your upload handler
                  />
                </label>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-semibold">
                {userInfo.fullName || "Unnamed User"}
              </h1>
              <p className="text-sm">@{userInfo.username}</p>
              <p className="text-sm opacity-80">
                Joined {new Date(userInfo.timestamp).toLocaleDateString()}
              </p>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => setEditing((prev) => !prev)}
                  variant="outline"
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </div>

          {editing && (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input
                  name="fullName"
                  value={userInfo.fullName || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Username</Label>
                <Input
                  name="username"
                  value={userInfo.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Role</Label>
                <Select disabled defaultValue={userInfo.role}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="User Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="RESELLER">Reseller</SelectItem>
                    <SelectItem value="PARTNER">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Balance</Label>
                <Input
                  name="balance"
                  value={
                    convert(
                      userInfo.currency,
                      userCurrency,
                      userInfo.balance,
                      true,
                      false
                    ).amount
                  }
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label>Currency</Label>
                <CurrencySelect />
                <p className="text-sm text-muted-foreground">
                  Selected currency: {userCurrency}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    name="apiKey"
                    value={showApiKey ? userInfo?.apiKey : maskedKey}
                    readOnly
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      if (btnApiKeyVisible) {
                        setShowApiKey(!showApiKey);
                      }
                    }}
                    disabled={!btnApiKeyVisible}
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4 mr-1" />
                    ) : (
                      <Eye className="w-4 h-4 mr-1" />
                    )}
                    {showApiKey ? "Hide" : "Reveal"}
                  </Button>
                  <Button
                    variant="default"
                    type="button"
                    onClick={regenerateApiKey}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </Card>
      </motion.section>
    </main>
  );
}
