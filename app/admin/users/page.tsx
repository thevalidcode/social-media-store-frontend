"use client";

import React, { useEffect, useMemo, useState } from "react";
import UserTable from "./components/UserTable";
import UserCardList from "./components/UserCardList";
import DeleteDialog from "./components/DeleteDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile"; // your hook
import { User, UserStatus } from "@/types";
import Pagination from "@/components/pagination";
import EditUserModal from "./components/EditUserModal";
import {
  useDeleteMultipleUsers,
  useGetUsers,
  useUpdateUserByAdmin,
} from "@/hooks/use-user";
import { EmptyState } from "@/components/empty-state";
import { Users } from "lucide-react";
import Loading from "@/app/loading";

export default function UsersPage() {
  const [users, setUsers] = useState<User[] | []>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | User["status"]>(
    "all"
  );
  const [sortField, setSortField] = useState<keyof User>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<User>(null as any);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: usersData, isLoading } = useGetUsers();
  const { mutate } = useDeleteMultipleUsers();
  const { mutate: updateUser } = useUpdateUserByAdmin();

  const isMobile = useIsMobile();

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  // derived lists
  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [users, search, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDirection === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      if (typeof av === "number" && typeof bv === "number") {
        return sortDirection === "asc" ? av - bv : bv - av;
      }
      return 0;
    });
    return arr;
  }, [filtered, sortField, sortDirection]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No User Found"
        description="No user has been created yet."
      />
    );
  }

  const current = sorted.slice((page - 1) * pageSize, page * pageSize);

  // handlers
  const toggleSelect = (id: number, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };
  const selectAllCurrent = (checked: boolean) => {
    if (checked) setSelected(current.map((u) => u.storeScopedId));
    else setSelected([]);
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field)
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers((prev: any[]) =>
      prev.map((u) =>
        u.storeScopedId === updatedUser.storeScopedId ? updatedUser : u
      )
    );
    updateUser(updatedUser);
  };

  const handleDeleteSingle = (id: number) => {
    setDeleteIds([id]);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    const usersUids = users
      .filter((u) => deleteIds.includes(u.storeScopedId))
      .map((u) => u.uid);
    mutate({ uids: usersUids });
    setUsers((prev) =>
      prev.filter((u) => !deleteIds.includes(u.storeScopedId))
    );
    setSelected((prev) => prev.filter((id) => !deleteIds.includes(id)));
    setDeleteIds([]);
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    setDeleteIds(selected);
    setDeleteOpen(true);
  };

  const namesForDelete = users
    .filter((u) => deleteIds.includes(u.storeScopedId))
    .map((u) => u.username);

  const handleToggleBan = (storeScopedId: number) => {
    let updatedUser: User | null = null;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.storeScopedId !== storeScopedId) return u;

        const newUser = {
          ...u,
          status: u.status === "BANNED" ? "ACTIVE" : ("BANNED" as UserStatus),
        };

        updatedUser = newUser;
        return newUser;
      })
    );

    if (updatedUser) {
      updateUser(updatedUser);
    }
  };

  const handleBanSelectedUsers = (
    selectedIds: number[],
    users: User[],
    setUsers: React.Dispatch<React.SetStateAction<User[]>>,
    updateUser: (user: User) => void
  ) => {
    const updatedUsers: User[] = [];

    setUsers((prev) =>
      prev.map((u) => {
        if (!selectedIds.includes(u.storeScopedId)) return u;

        const updated = { ...u, status: "BANNED" as UserStatus };
        updatedUsers.push(updated);
        return updated;
      })
    );

    // Call updateUser for each updated user
    updatedUsers.forEach((u) => updateUser(u));
  };

  return (
    <main className="p-6 space-y-6">
      {/* Header / controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-72"
          />
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as any);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="BANNED">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => {
              setUsers(usersData || []);
              setSelected([]);
              setSearch("");
              setStatusFilter("all");
              setPage(1);
            }}
          >
            Reset
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selected.length === 0}
          >
            Delete Selected
          </Button>
        </div>
      </div>

      {/* Bulk selection bar */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">
            {selected.length} selected
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleBanSelectedUsers(selected, users, setUsers, updateUser)
              }
            >
              Ban
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteSelected}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Responsive content */}
      {!isMobile ? (
        <UserTable
          users={current}
          selected={selected}
          onSelectAll={selectAllCurrent}
          onSelect={toggleSelect}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDeleteSingle}
          onToggleBan={handleToggleBan}
        />
      ) : (
        <UserCardList
          users={current}
          selected={selected}
          onSelect={toggleSelect}
          onEdit={handleEdit}
          onDelete={handleDeleteSingle}
          onToggleBan={handleToggleBan}
        />
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={sorted.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 20, 50]}
      />

      {/* Delete dialog */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        count={deleteIds.length}
        names={namesForDelete}
        entityName="user"
      />

      {/* Edit user modal */}
      <EditUserModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </main>
  );
}
