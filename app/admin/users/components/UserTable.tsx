// UserTable.tsx
"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import UserStatusBadge from "./UserStatusBadge";
import UserActionsMenu from "./UserActionsMenu";
import { User } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { DateTime } from "@/lib/DateTime";

export default function UserTable({
  users,
  selected,
  onSelectAll,
  onSelect,
  onEdit,
  onDelete,
  onToggleBan,
}: {
  users: User[];
  selected: number[];
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: number, checked: boolean) => void;
  onSort: (field: keyof User) => void;
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;
  onToggleBan: (id: number) => void;
}) {
  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selected.length > 0 && selected.length === users.length
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.storeScopedId}>
              <TableCell>
                <Checkbox
                  checked={selected.includes(u.storeScopedId)}
                  onCheckedChange={(v) =>
                    onSelect(u.storeScopedId, v as boolean)
                  }
                />
              </TableCell>
              <TableCell className="font-medium">{u.storeScopedId}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={u.image ?? `/avatar.png`}
                    alt={u.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{u.username}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {u.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {
                  convert(u.currency, userCurrency, u.balance, true, false)
                    .formatted
                }
              </TableCell>
              <TableCell>
                {" "}
                {
                  convert(u.currency, userCurrency, u.spent, true, false)
                    .formatted
                }
              </TableCell>

              <TableCell className="text-sm text-muted-foreground">
                {u.timestamp ? (
                  <DateTime date={u.timestamp} formatStr="yyyy-MM-dd" />
                ) : (
                  "N/A"
                )}
              </TableCell>

              <TableCell className="text-sm text-muted-foreground">
                {u.lastSeen ? (
                  <DateTime date={u.lastSeen} formatStr="PPP p" relative />
                ) : (
                  "N/A"
                )}
              </TableCell>

              <TableCell>
                <UserStatusBadge status={u.status} />
              </TableCell>
              <TableCell className="text-right">
                <UserActionsMenu
                  user={u}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleBan={onToggleBan}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
