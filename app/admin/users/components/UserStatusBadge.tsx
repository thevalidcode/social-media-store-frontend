"use client";

import React from "react";

export default function UserStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    active: {
      label: "Active",
      classes: "text-green-700 bg-green-100 border-green-200",
    },
    offline: {
      label: "Offline",
      classes: "text-red-700 bg-red-100 border-red-200",
    },
    away: {
      label: "Away",
      classes: "text-amber-700 bg-amber-100 border-amber-200",
    },
    banned: {
      label: "Banned",
      classes: "text-zinc-700 bg-zinc-100 border-zinc-200",
    },
  };

  const { label, classes } = config[status] ?? {
    label: status,
    classes: "text-muted-foreground bg-muted",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${classes}`}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: undefined }}
      />
      {label}
    </span>
  );
}
