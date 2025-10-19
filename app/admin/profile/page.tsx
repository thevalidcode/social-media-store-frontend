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

type AdminProfile = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  currency: string;
  avatar: string;
  joinedAt: string;
};

const mockAdmin: AdminProfile = {
  id: "a1",
  name: "Valid Admin",
  username: "validadmin",
  email: "admin@validplug.com",
  role: "Super Admin",
  currency: "USD",
  avatar: "https://picsum.photos/seed/admin/200",
  joinedAt: "2023-05-12",
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile>(mockAdmin);
  const [editing, setEditing] = useState(false);

  const router = useRouter();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  function handleCurrencyChange(value: string) {
    setProfile((prev) => ({ ...prev, currency: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Updated Admin Profile:", profile);
    setEditing(false);
  }

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
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 rounded-full object-cover border border-primary/40"
            />

            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-semibold">{profile.name}</h1>
              <p className="text-sm">@{profile.username}</p>
              <p className="text-sm opacity-80">
                Joined {new Date(profile.joinedAt).toLocaleDateString()}
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
                  name="name"
                  value={profile.name}
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
                <Select disabled defaultValue={profile.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Currency</Label>
                <Select
                  value={profile.currency}
                  onValueChange={handleCurrencyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">
                      USD - United States Dollar
                    </SelectItem>
                    <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
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
