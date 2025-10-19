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
import { RefreshCw } from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  currency: string;
  balance: number;
  apiKey: string;
  avatar: string;
  joinedAt: string;
};

const mockUser: UserProfile = {
  id: "u1",
  name: "Valid User",
  username: "validuser",
  email: "user@validplug.com",
  role: "Reseller",
  currency: "NGN",
  balance: 25000,
  apiKey: "sk_live_abc123xyz",
  avatar: "https://picsum.photos/seed/user/200",
  joinedAt: "2024-01-03",
};

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockUser);
  const [editing, setEditing] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  function handleCurrencyChange(value: string) {
    setProfile((prev) => ({ ...prev, currency: value }));
  }

  function regenerateApiKey() {
    const newKey =
      "sk_live_" +
      Math.random().toString(36).substring(2, 10) +
      Date.now().toString(36);
    setProfile((prev) => ({ ...prev, apiKey: newKey }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Updated User Profile:", profile);
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
                    <SelectItem value="Reseller">Reseller</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Balance</Label>
                <Input
                  name="balance"
                  value={profile.balance}
                  onChange={handleChange}
                  disabled
                />
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

              <div className="grid gap-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input name="apiKey" value={profile.apiKey} readOnly />
                  <Button
                    variant="secondary"
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
