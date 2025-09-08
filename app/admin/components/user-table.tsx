"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AxiosError } from "axios";
import {
  ArrowUpDown,
  BanIcon,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Edit,
  LockIcon,
  MoreHorizontal,
  Search,
  ShoppingCart,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { CSSProperties, useState } from "react";
import { toast } from "sonner";
import { CreateUser } from "./create_user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { EditUser } from "./edit-user";
import Loading from "@/app/loading";
import {
  useDeleteASingleUser,
  useDeleteMultipleUsers,
  useGetUsers,
} from "@/hooks/use-user";

interface User {
  id: number;
  ref_code?: number;
  uid?: string;
  email: string;
  image?: string | null;
  username: string;
  role?: string;
  status: string;
  storeId?: number;
  balance: number;
  spent: number;
  timestamp?: string;
  last_seen?: string;
  currency?: string;
  ref?: null;
}

type SortField = keyof Pick<
  User,
  "id" | "username" | "email" | "balance" | "spent"
>;
type SortDirection = "asc" | "desc";

export default function UserDataTable() {
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogUserIds, setDeleteDialogUserIds] = useState<number[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({
    uid: "",
    username: "",
    email: "",
    full_name: "",
    balance: 0,
  });

  const { data: users = [], isLoading, error } = useGetUsers();
  const { mutate: deleteAUser } = useDeleteASingleUser();
  const { mutate: deleteMultipleUsers } = useDeleteMultipleUsers();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user: User) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a: User, b: User) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(sortedUsers.map((user: User) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const convertToRegistrationDate = (DATE: string) => {
    return new Date(DATE).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      minute: "2-digit",
      hour: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: User["status"]) => {
    const statusConfig: {
      [key: string]: {
        label: string;
        color: string;
      };
    } = {
      active: {
        label: "Active",
        color: "#22c55e", // green-500
      },
      offline: {
        label: "Offline",
        color: "#ef4444", // red-500
      },
      away: {
        label: "Away",
        color: "#f59e0b", // amber-500
      },
      banned: {
        label: "Banned",
        color: "#84cc16", // lime-500
      },
    };

    const config = statusConfig[status] || statusConfig.offline;

    const badgeStyle: CSSProperties = {
      backgroundColor: `${config.color}20`, // 20% opacity
      color: config.color,
      border: `1px solid ${config.color}`,
      padding: "4px 8px",
      borderRadius: "9999px",
      display: "inline-flex",
      alignItems: "center",
      fontWeight: "500",
      textTransform: "capitalize",
    };

    const dotStyle: CSSProperties = {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: config.color,
      marginRight: "6px",
    };

    return (
      <div style={badgeStyle}>
        <div style={dotStyle} />
        <span>{config.label}</span>
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle deleting multiple users
  const handleDeleteMultipleUsers = (userIds: number[]) => {
    // Convert user IDs to UIDs (assuming uid is string representation of id)
    const uids = userIds.map((id) => {
      const user = users.find((u: User) => u.id === id);
      return user?.uid || String(id);
    });

    deleteMultipleUsers(
      { uids },
      {
        onSuccess: () => {
          toast.success(`${userIds.length} user(s) deleted successfully`);
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setDeleteDialogOpen(false);
          setSelectedUsers([]);
        },
        onError: (error: unknown) => {
          if (error instanceof AxiosError) {
            toast.error(
              error.response?.data?.error || "Failed to delete users",
            );
          } else {
            toast.error("Failed to delete users");
          }
          setDeleteDialogOpen(false);
        },
      },
    );
  };

  // Handle deleting a single user
  const handleDeleteSingleUser = (userId: number) => {
    const user = users.find((u: User) => u.id === userId);
    const uid = user?.uid || String(userId);

    deleteAUser(
      { uid },
      {
        onSuccess: () => {
          toast.success("User deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setDeleteDialogOpen(false);
          setSelectedUsers((prev) => prev.filter((id) => id !== userId));
        },
        onError: (error: unknown) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.error || "Failed to delete user");
          } else {
            toast.error("Failed to delete user");
          }
          setDeleteDialogOpen(false);
        },
      },
    );
  };

  // Open delete dialog for single or multiple users
  const openDeleteDialog = (userIds: number[]) => {
    setDeleteDialogUserIds(userIds);
    setDeleteDialogOpen(true);
  };

  // Get usernames by IDs for display in dialog
  const getUsernamesByIds = (ids: number[]) => {
    return users
      .filter((u: User) => ids.includes(u.id))
      .map((u: User) => u.username);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteDialogUserIds.length === 1) {
      handleDeleteSingleUser(deleteDialogUserIds[0]);
    } else {
      handleDeleteMultipleUsers(deleteDialogUserIds);
    }
  };

  // Handle deleting selected users
  const handleDeleteSelected = () => {
    if (selectedUsers.length > 0) {
      openDeleteDialog(selectedUsers);
    }
  };

  const handleEditUser = (user: User) => {
    setEditUserData({
      uid: String(user.id),
      username: user.username,
      email: user.email,
      full_name: user.username,
      balance: user.balance,
    });
    setEditDialogOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <CreateUser />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              {deleteDialogUserIds.length === 1 ? (
                <>
                  Are you sure you want to delete user{" "}
                  <span className="font-semibold">
                    {getUsernamesByIds(deleteDialogUserIds)[0]}
                  </span>
                  ? This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {deleteDialogUserIds.length}
                  </span>{" "}
                  users? This action cannot be undone.
                  <br />
                  <br />
                  Users to be deleted:{" "}
                  <span className="font-medium">
                    {getUsernamesByIds(deleteDialogUserIds).join(", ")}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete {deleteDialogUserIds.length === 1 ? "User" : "Users"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedUsers.length} user(s) selected
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <UserCheck className="h-4 w-4 mr-2" />
              Activate
            </Button>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <UserX className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="cursor-pointer"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <ScrollArea>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedUsers.length === sortedUsers.length &&
                      sortedUsers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("id")}
                    className="h-auto p-0 font-semibold"
                  >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("username")}
                    className="h-auto p-0 font-semibold"
                  >
                    Username & Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("balance")}
                    className="h-auto p-0 font-semibold"
                  >
                    Balance
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("spent")}
                    className="h-auto p-0 font-semibold"
                  >
                    Spent
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) =>
                          handleSelectUser(user.id, checked as boolean)
                        }
                        aria-label={`Select user ${user.username}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(user.balance)}
                    </TableCell>
                    <TableCell>{formatCurrency(user.spent)}</TableCell>
                    <TableCell>
                      {user.timestamp
                        ? convertToRegistrationDate(user.timestamp)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {user.last_seen
                        ? convertToRegistrationDate(user.last_seen)
                        : "N/A"}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Manage Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            User Orders
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BanIcon className="mr-2 h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LockIcon size={16} className="mr-2 h-4 w-4" />
                            Change Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog([user.id])}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-4">
        <div className="flex items-center space-x-2">
          <p className="text-muted-foreground hidden sm:block">
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, sortedUsers.length)} of{" "}
            {sortedUsers.length} users
          </p>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">per page</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="hidden sm:flex"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="sm:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageToShow: number | null = null;

              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageToShow}
                  variant={currentPage === pageToShow ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0 mx-1 hidden sm:flex"
                  onClick={() => handlePageChange(pageToShow as number)}
                >
                  {pageToShow}
                </Button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="mx-1 hidden sm:block">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 mx-1 hidden sm:flex"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="hidden sm:flex"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="sm:hidden"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EditUser
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        formData={editUserData}
        onFormDataChange={setEditUserData}
      />
    </div>
  );
}
