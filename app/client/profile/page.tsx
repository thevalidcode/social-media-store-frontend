"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, RefreshCw, Camera } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { mutateAsync: updateUser, isPending } = useUpdateUser();
  const { mutateAsync: uploadImage, isPending: uploadingImage } =
    useUploadImage();

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateUser({
      username: userInfo?.username ?? "",
      image: userInfo?.image ?? "",
      fullName: userInfo?.fullName ?? "",
      apiKey: userInfo?.apiKey ?? "",
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
    <main className="min-h-screen w-full p-6 bg-background">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-5xl"
      >
        <Card className="rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="relative h-32 w-32 shrink-0">
              <img
                src={userInfo.image ?? "/images/default-profile.jpg"}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border"
              />

              {editing && (
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-semibold">
                {userInfo.fullName || "Unnamed User"}
              </h1>
              <p className="text-sm text-muted-foreground">
                @{userInfo.username}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Joined {new Date(userInfo.timestamp).toLocaleDateString()}
              </p>

              <div className="mt-6">
                <Button variant="outline" onClick={() => setEditing((v) => !v)}>
                  {editing ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {editing && (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <Field label="Full Name">
                <Input
                  name="fullName"
                  value={userInfo.fullName || ""}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Username">
                <Input
                  name="username"
                  value={userInfo.username}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Email">
                <Input
                  name="email"
                  type="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  disabled
                />
              </Field>

              <Field label="Role">
                <Select disabled value={userInfo.role}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="RESELLER">Reseller</SelectItem>
                    <SelectItem value="PARTNER">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Balance">
                <Input
                  disabled
                  type="text"
                  value={
                    convert(
                      userInfo.currency,
                      userCurrency,
                      userInfo.balance,
                      true,
                      false
                    ).formatted
                  }
                />
              </Field>

              <Field label="Currency">
                <CurrencySelect />
                <p className="text-sm text-muted-foreground">
                  Selected currency: {userCurrency}
                </p>
              </Field>

              <Field label="API Key">
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={showApiKey ? userInfo.apiKey : maskedKey}
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={!btnApiKeyVisible}
                    onClick={() => setShowApiKey((v) => !v)}
                  >
                    {showApiKey ? (
                      <EyeOff className="mr-1 h-4 w-4" />
                    ) : (
                      <Eye className="mr-1 h-4 w-4" />
                    )}
                    {showApiKey ? "Hide" : "Reveal"}
                  </Button>

                  <Button type="button" onClick={regenerateApiKey}>
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </Field>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </motion.section>
    </main>
  );
}

/* ---------------- helpers ---------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
