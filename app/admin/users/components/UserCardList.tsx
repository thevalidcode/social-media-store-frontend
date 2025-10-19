"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import UserStatusBadge from "./UserStatusBadge";
import UserActionsMenu from "./UserActionsMenu";
import { User } from "@/types";

export default function UserCardList({
  users,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onToggleBan,
  onActivate,
}: {
  users: User[];
  selected: number[];
  onSelect: (id: number, checked: boolean) => void;
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;
  onToggleBan: (id: number) => void;
  onActivate: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((u) => (
        <Card key={u.id} className="rounded-2xl overflow-hidden">
          <CardHeader className="flex items-start gap-3 p-4">
            <Checkbox
              checked={selected.includes(u.id)}
              onCheckedChange={(v) => onSelect(u.id, v as boolean)}
            />
            <img
              src={u.image ?? `/avatar.png`}
              alt={u.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium truncate">{u.username}</div>
                <UserStatusBadge status={u.status} />
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {u.email}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <div className="text-muted-foreground">Balance</div>
              <div className="font-medium">${u.balance.toFixed(2)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted-foreground">Spent</div>
              <div className="font-medium">${u.spent.toFixed(2)}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              Last seen:{" "}
              {u.lastSeen ? new Date(u.lastSeen).toLocaleString() : "N/A"}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => onEdit(u)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleBan(u.id)}
              >
                {u.status === "banned" ? "Unban" : "Ban"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <UserActionsMenu
                user={u}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleBan={onToggleBan}
                onActivate={onActivate}
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
