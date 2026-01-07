"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Settings, Users, ShoppingCart, Camera } from "lucide-react";

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

import { currency } from "@/app/_docs/doc";
import { useAppContext } from "@/context/appContext";
import { useUpdateAdmin } from "@/hooks/use-admin";
import { useUploadImage } from "@/hooks/use-file";
import type { Admin } from "@/types";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const router = useRouter();
  const { adminInfo, userCurrency, setUserCurrency } = useAppContext();

  const [profile, setProfile] = useState<Admin>(adminInfo!);
  const [editing, setEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { mutateAsync: updateAdmin } = useUpdateAdmin();
  const { mutateAsync: uploadImage } = useUploadImage();

  if (!profile) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await updateAdmin({
      fullName: profile.fullName ?? undefined,
      username: profile.username,
      image: profile.image || "",
    });

    toast.success("Profile updated");
    setEditing(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadImage({
        file,
        collection: "admins",
      });

      await updateAdmin({ image: res.url });
      setProfile((prev) => ({ ...prev, image: res.url }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <main className="min-h-screen w-full p-6 bg-background">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-5xl"
      >
        <Card className="rounded-2xl p-8 shadow-sm">
          {/* Profile Header */}
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="relative h-32 w-32 shrink-0">
              <img
                src={profile.image ?? "/images/default-profile.jpg"}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border"
              />

              {editing && (
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{profile.fullName}</h1>
              <p className="text-sm text-muted-foreground">
                @{profile.username}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Joined {new Date(profile.timestamp).toLocaleDateString()}
              </p>

              <div className="mt-6">
                <Button variant="outline" onClick={() => setEditing((v) => !v)}>
                  {editing ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </div>

          {/* Management Shortcuts */}
          {!editing && (
            <section className="mt-10 space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Administration
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <AdminCard
                  icon={Users}
                  label="Users"
                  onClick={() => router.push("/admin/users")}
                />
                <AdminCard
                  icon={ShoppingCart}
                  label="Orders"
                  onClick={() => router.push("/admin/orders")}
                />
                <AdminCard
                  icon={Settings}
                  label="Settings"
                  onClick={() => router.push("/admin/settings")}
                />
              </div>
            </section>
          )}

          {/* Edit Form */}
          {editing && (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <Field label="Full Name">
                <Input
                  name="fullName"
                  value={profile.fullName || ""}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Username">
                <Input
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Email">
                <Input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled
                />
              </Field>

              <Field label="Role">
                <Select disabled value={profile.role}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER">Super Admin</SelectItem>
                    <SelectItem value="BASIC">Basic Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="SUPPORT_STAFF">Support Staff</SelectItem>
                    <SelectItem value="FINANCE_OFFICER">
                      Finance Officer
                    </SelectItem>
                    <SelectItem value="SERVICE_OPERATOR">
                      Service Operator
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Currency">
                <Select value={userCurrency} onValueChange={setUserCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(currency).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {k} - {v.split("|")[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
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

/* ----------------- Small helpers ----------------- */

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

function AdminCard({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer rounded-xl border bg-secondary/40 p-4 transition hover:bg-secondary"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Card>
  );
}
