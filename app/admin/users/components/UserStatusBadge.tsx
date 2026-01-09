"use client";

import { UserStatus } from "@/types";
import React from "react";

export default function UserStatusBadge({ status }: { status: UserStatus }) {
  const config: Record<
    string,
    { label: UserStatus; classes: string; dot: string }
  > = {
    active: {
      label: "ACTIVE",
      classes: "text-green-700 bg-green-100 border-green-200",
      dot: "#16a34a",
    },
    inactive: {
      label: "INACTIVE",
      classes: "text-red-700 bg-red-100 border-red-200",
      dot: "#dc2626",
    },
    banned: {
      label: "BANNED",
      classes: "text-zinc-700 bg-zinc-100 border-zinc-200",
      dot: "#6b7280",
    },
  };

  // normalize
  const key = status?.toLowerCase() || "active";
  const { label, classes, dot } = config[key] ?? {
    label: status || "ACTIVE",
    classes: "text-muted-foreground bg-muted",
    dot: "#fff",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${classes}`}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
      {label}
    </span>
  );
}
