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
import { Settings, Users, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { currency } from "@/app/_docs/doc";
import { useAppContext } from "@/context/appContext";
import { Admin } from "@/types";
import { useUpdateAdmin } from "@/hooks/use-admin";
import { useUploadImage } from "@/hooks/use-file";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const { adminInfo, userCurrency, setUserCurrency } = useAppContext();
  const [profile, setProfile] = useState<Admin>(adminInfo!);
  const [editing, setEditing] = useState(false);
  const { mutateAsync: updateAdmin } = useUpdateAdmin();
  const { mutateAsync: uploadImage } = useUploadImage();

  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Sanitize profile to match UpdateAdminProps type
    const sanitizedProfile = {
      ...profile,
      fullName: profile.fullName ?? undefined,
      image: profile.image ?? undefined,
    };

    updateAdmin(sanitizedProfile);
    setEditing(false);
  }

  if (!profile) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    const response = await uploadImage({ file: file!, collection: "admins" });
    await updateAdmin({ image: response.url });
    setProfile((prev) => ({ ...prev, image: response.url }));
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
                src={profile?.image ?? "/images/default-profile.jpg"}
                alt={profile.fullName ?? "Admin Profile"}
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
              <h1 className="text-2xl font-semibold">{profile.fullName}</h1>
              <p className="text-sm">@{profile.username}</p>
              <p className="text-sm opacity-80">
                Joined {new Date(profile.timestamp).toLocaleDateString()}
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

          {!editing && (
            <div className="grid sm:grid-cols-3 gap-4 mt-10">
              <Card
                onClick={() => router.push("/admin/users")}
                className="p-5 text-center hover:bg-accent transition-colors cursor-pointer"
              >
                <Users className="mx-auto mb-2 text-primary" />
                <p className="font-medium">Manage Users</p>
              </Card>
              <Card
                onClick={() => router.push("/admin/orders")}
                className="p-5 text-center hover:bg-accent transition-colors cursor-pointer"
              >
                <ShoppingCart className="mx-auto mb-2 text-primary" />
                <p className="font-medium">Manage Orders</p>
              </Card>
              <Card
                onClick={() => router.push("/admin/settings")}
                className="p-5 text-center hover:bg-accent transition-colors cursor-pointer"
              >
                <Settings className="mx-auto mb-2 text-primary" />
                <p className="font-medium">System Settings</p>
              </Card>
            </div>
          )}

          {editing && (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input
                  name="fullName"
                  type="text"
                  value={profile.fullName || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Username</Label>
                <Input
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Role</Label>
                <Select disabled value={profile.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
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
              </div>

              <div className="grid gap-2">
                <Label>Currency</Label>
                <Select value={userCurrency} onValueChange={setUserCurrency}>
                  <SelectTrigger id="adminCurrency">
                    <SelectValue placeholder="Select currency..." />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(currency).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {key} - {value.split("|")[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
