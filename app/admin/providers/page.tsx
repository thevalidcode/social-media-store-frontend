"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteMultipleProviders,
  useDeleteProvider,
  useGetProviders,
} from "@/hooks/use-providers";
import { useQueryClient } from "@tanstack/react-query";
import { Network, Trash } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Provider } from "@/types";
import ProviderDialog from "./components/ProviderDialog";
import { EmptyState } from "@/components/empty-state";
import { useAppContext } from "@/context/appContext";
import { ProvidersHeader } from "./components/ProvidersHeader";
import { ProviderCardList } from "./components/ProviderCardList";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [providersToDelete, setProvidersToDelete] = useState<Provider | null>(
    null,
  );
  const { data: providersData, isLoading } = useGetProviders();
  const { mutate: deleteSingleProvider } = useDeleteProvider();
  const { mutate: deleteMultipleProviders } = useDeleteMultipleProviders();
  const queryClient = useQueryClient();
  const { storeInfo } = useAppContext();
  const isSubscriptionActive = storeInfo?.subscriptionStatus === "ACTIVE";

  const providersList: Provider[] = Array.isArray(providersData)
    ? providersData
    : providersData || [];

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return providersList;

    return providersList.filter(
      (provider) =>
        provider.name.toLowerCase().includes(query) ||
        provider.url.toLowerCase().includes(query),
    );
  }, [providersList, search]);

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
    if (!selectedProviders.includes(provider.uid)) {
      setSelectedProviders([]);
    }
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
        onError: () => {
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
      });
    }
  };

  const handleSelectProvider = (uid: string) => {
    setSelectedProviders((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid],
    );
  };

  const handleSelectAll = () => {
    if (selectedProviders.length === filteredProviders.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(filteredProviders.map((provider) => provider.uid));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!providersList.length) {
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
          isSubscriptionActive={isSubscriptionActive}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <ProvidersHeader
        search={search}
        onSearchChange={setSearch}
        onCreateClick={() => handleOpenDialog()}
        selectedCount={selectedProviders.length}
        allSelected={
          filteredProviders.length > 0 &&
          selectedProviders.length === filteredProviders.length
        }
        onSelectAll={handleSelectAll}
        canManageProviders={isSubscriptionActive}
      />

      {selectedProviders.length > 0 && (
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={() => setDeleteDialogOpen(true)}
          id="deleteMany"
        >
          <Trash className="h-4 w-4" />
          Delete selected ({selectedProviders.length})
        </Button>
      )}

      {filteredProviders.length === 0 ? (
        <EmptyState
          icon={Network}
          title="No Provider Match"
          description="No providers match your current search."
        />
      ) : (
        <ProviderCardList
          providers={filteredProviders}
          selectedProviders={selectedProviders}
          onSelectProvider={handleSelectProvider}
          onEditProvider={handleOpenDialog}
          onDeleteProvider={handleDeleteClick}
          isSubscriptionActive={isSubscriptionActive}
        />
      )}

      <ProviderDialog
        isEdit={isEdit}
        isOpen={isOpen}
        provider={providers}
        onClose={handleCloseDialog}
        isSubscriptionActive={isSubscriptionActive}
      />

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
