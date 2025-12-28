"use client";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteMultipleProviders,
  useDeleteProvider,
  useGetProviders,
} from "@/hooks/use-providers";
import { useQueryClient } from "@tanstack/react-query";
import { Network, Pencil, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Provider } from "@/types";
import ProviderDialog from "./components/ProviderDialog";
import { EmptyState } from "@/components/empty-state";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [providersToDelete, setProvidersToDelete] = useState<Provider | null>(
    null
  );
  const { data: providersData, isLoading } = useGetProviders();
  const { mutate: deleteSingleProvider } = useDeleteProvider();
  const { mutate: deleteMultipleProviders } = useDeleteMultipleProviders();
  const queryClient = useQueryClient();
  const isVisible = false;
  const providersList: Provider[] = Array.isArray(providersData)
    ? providersData
    : providersData || [];

  const handleOpenDialog = (provider?: Provider) => {
    setIsOpen(true);
    setIsEdit(!!provider);
    setProviders(provider || null);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setProviders(null);
  };

  const handleDeleteClick = (provider: Provider) => {
    setSelectedProviders([]);
    setProvidersToDelete(provider);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedProviders.length > 0) {
      deleteMultipleProviders(selectedProviders, {
        onSuccess: () => {
          toast.success("Providers successfully deleted");
          queryClient.invalidateQueries({ queryKey: ["providers"] });
          setSelectedProviders([]);
          setDeleteDialogOpen(false);
          setProvidersToDelete(null); // also clear this
        },
        onError: (error: Error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to delete providers"
          );
          setDeleteDialogOpen(false);
        },
      });
    } else if (providersToDelete?.uid) {
      deleteSingleProvider(providersToDelete.uid, {
        onSuccess: () => {
          toast.success("Provider deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["providers"] });
          setDeleteDialogOpen(false);
          setProvidersToDelete(null);
        },
        onError: (error: Error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to delete provider"
          );
        },
      });
    }
  };

  const handleSelectProvider = (uid: string) => {
    setSelectedProviders((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSelectAll = () => {
    if (selectedProviders.length === providersList?.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(
        providersList?.map((provider: Provider) => provider.uid as string) || []
      );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!providersList || providersList.length === 0) {
    return (
      <>
        <EmptyState
          icon={Network}
          title="No Provider Found"
          description="No provider have been created yet."
          actionLabel="Create Provider"
          onAction={() => handleOpenDialog()}
        />{" "}
        <ProviderDialog
          isEdit={isEdit}
          isOpen={isOpen}
          provider={providers}
          onClose={handleCloseDialog}
        />
      </>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {/* Top Actions */}
        <div className="flex justify-end items-center gap-2">
          {selectedProviders.length > 1 && (
            <AnimatePresence>
              {!isVisible && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => setDeleteDialogOpen(true)}
                    id="deleteMany"
                  >
                    <Trash className="h-4 w-4" />
                    Delete selected ({selectedProviders.length})
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <Button className="cursor-pointer" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4" />
            Add Provider
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={
                      providersList.length > 0 &&
                      selectedProviders.length === providersList.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providersList.map((p) => (
                <TableRow key={p.storeScopedId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProviders.includes(p.uid as string)}
                      onCheckedChange={() => handleSelectProvider(p.uid)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {p.storeScopedId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.image ? p.image: `/provider.png`}
                        alt={p.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{p.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {p.url}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{p.sync ? `${p.percentage}%` : "N/A"}</TableCell>
                  <TableCell>{p.sync ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(p)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(p)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {providersList.map((p) => (
            <Card key={p.storeScopedId} className="rounded-2xl overflow-hidden">
              <CardHeader className="flex items-start gap-3 p-4">
                <Checkbox
                  checked={selectedProviders.includes(p.uid as string)}
                  onCheckedChange={() => handleSelectProvider(p.uid)}
                />
                <img
                  src={p.image ?? `/provider.png`}
                  alt={p.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {p.url}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Percentage</div>
                  <div className="font-medium">
                    {p.sync ? `${p.percentage}%` : "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-muted-foreground">Sync</div>
                  <div className="font-medium">{p.sync ? "Yes" : "No"}</div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center p-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenDialog(p)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteClick(p)}
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <ProviderDialog
        isEdit={isEdit}
        isOpen={isOpen}
        provider={providers}
        onClose={handleCloseDialog}
      />

      {/* delete dialog */}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              {selectedProviders.length > 0
                ? `Are you sure you want to delete ${selectedProviders.length} selected provider(s)?`
                : "Are you sure you want to delete this provider?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
