"use client";
import Loading from "@/app/loading";
import { TypographySmall } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ProviderProps,
  useCreateProvider,
  useDeleteMultipleProviders,
  useDeleteProvider,
  useGetProviders,
  useUpdateProvider,
} from "@/hooks/use-providers";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
export default function AdminProviders() {
  const [providers, setProviders] = useState<ProviderProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [providersToDelete, setProvidersToDelete] =
    useState<ProviderProps | null>(null);
  const { data: providersData, isLoading } = useGetProviders();
  const { mutate: deleteSingleProvider } = useDeleteProvider();
  const { mutate: deleteMultipleProviders } = useDeleteMultipleProviders();
  const queryClient = useQueryClient();
  const isVisible = false;
  const providersList: ProviderProps[] = Array.isArray(providersData)
    ? providersData
    : providersData?.providers || [];

  const handleOpenDialog = (provider?: ProviderProps) => {
    setIsOpen(true);
    setIsEdit(!!provider);
    setProviders(provider || null);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setProviders(null);
  };

  const handleDeleteClick = (provider: ProviderProps) => {
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
              : "Failed to delete providers",
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
            error instanceof Error
              ? error.message
              : "Failed to delete provider",
          );
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
    if (selectedProviders.length === providersList?.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(
        providersList?.map(
          (provider: ProviderProps) => provider.uid as string,
        ) || [],
      );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-2 lg:p-6 max-w-6xl">
      <Card className="bg-transparent shadow-none">
        <CardHeader>
          <div className="flex justify-end items-center gap-2  ">
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
                      <TrashIcon />
                      Delete selected( {`${selectedProviders.length}`})
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            <Button
              className="cursor-pointer"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="h-4 w-4" />
              Add A Provider
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!providersList || providersList.length === 0 ? (
            <div className="flex justify-center items-center mt-6">
              <TypographySmall>
                There are no providers in your collection.
              </TypographySmall>
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          providersList.length > 0 &&
                          selectedProviders?.length === providersList?.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-10">UID</TableHead>
                    <TableHead className="w-20">Name</TableHead>
                    <TableHead className="w-30">Url</TableHead>
                    <TableHead className="w-10">Percentage</TableHead>
                    <TableHead className="w-10">Sync</TableHead>

                    <TableHead className="w-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providersList?.map((provider: ProviderProps) => (
                    <TableRow key={provider.uid}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProviders.includes(
                            provider.uid as string,
                          )}
                          onCheckedChange={() =>
                            handleSelectProvider(provider.uid as string)
                          }
                        />
                      </TableCell>
                      <TableCell>{provider.uid}</TableCell>
                      <TableCell>{provider.name}</TableCell>
                      <TableCell>{provider.url}</TableCell>
                      <TableCell>
                        {provider.sync ? `${provider.percentage}%` : "N/A"}
                      </TableCell>
                      <TableCell>{provider.sync ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleOpenDialog(provider);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(provider)}
                            className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
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
          )}
        </CardContent>
      </Card>
      <ProviderDialog
        isEdit={isEdit}
        isOpen={isOpen}
        providers={providers}
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

interface ProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  providers: ProviderProps | null;
  isEdit: boolean;
}
function ProviderDialog({
  isOpen,
  onClose,
  providers,
  isEdit,
}: ProviderDialogProps) {
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [url, setUrl] = useState("");
  const [percentage, setPercentage] = useState<number>(0);
  const [checked, setChecked] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: createProvider } = useCreateProvider();
  const { mutate: UpdateProvider } = useUpdateProvider();

  // Populate form values on edit
  useEffect(() => {
    if (isEdit && providers) {
      setName(providers.name || "");
      setApiKey(providers.api_key || "");
      setUrl(providers.url || "");
      setChecked(providers.sync || false);
      setPercentage(providers.percentage || 0);
    } else {
      setName("");
      setApiKey("");
      setUrl("");
      setChecked(false);
      setPercentage(0);
    }
  }, [isOpen, isEdit, providers]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!apiKey || !url || !name) {
      toast.warning("all fields are required ")
    }
    const providerData = {
      name,
      api_key: apiKey,
      sync: checked,
      url: url,
      percentage: checked ? percentage : 0,
    };

    const mutation = isEdit && providers?.uid ? UpdateProvider : createProvider;

    mutation(isEdit ? { uid: providers!.uid, ...providerData } : providerData, {
      onSuccess: () => {
        toast.success(
          `Provider ${isEdit ? "updated" : "created"} successfully`,
        );
        queryClient.invalidateQueries({ queryKey: ["providers"] });
        onClose();
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to ${isEdit ? "update" : "create"} provider`,
        );
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <>
                <Pencil className="h-5 w-5 text-blue-500" />
                Edit Provider
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-green-500" />
                Create New Provider
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Make changes to your provider here."
              : "Add a new provider to your list."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Name Field */}
            <div className="flex flex-col lg:gap-2 gap-1">
              <Label htmlFor="providerName">Provider Name</Label>
              <Input
                id="providerName"
                // placeholder="e.g. example.com"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* API Key Field */}
            <div className="flex flex-col lg:gap-2 gap-1">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                // placeholder="Enter provider API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col lg:gap-2 gap-1">
              <Label htmlFor="url">Url</Label>
              <Input
                id="url"
                // placeholder="Enter provider url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            {/* Sync Switch */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="sync" className="font-medium text-base">
                  Sync services from provider
                </Label>
              </div>
              <Switch
                id="sync"
                checked={checked}
                onCheckedChange={setChecked}
              />
            </div>

            {/* Percentage Field */}
            {checked && (
              <motion.div
                className="space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Label htmlFor="percentage">Percentage</Label>
                <Input
                  type="number"
                  id="percentage"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  placeholder="Enter percentage (e.g. 20)"
                />
              </motion.div>
            )}

            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full sm:w-auto">
                {isEdit ? "Update Provider" : "Create Provider"}
              </Button>
            </DialogFooter>
          </motion.form>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
