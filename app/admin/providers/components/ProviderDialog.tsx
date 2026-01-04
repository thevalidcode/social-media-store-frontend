"use client";

import { Button } from "@/components/ui/button";
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
  useCreateProvider,
  useUpdateProvider,
  useGetAllServiceProviders,
} from "@/hooks/use-providers";
import { useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  Pencil,
  Plus,
  Image as ImageIcon,
  CheckCircle,
  Settings,
  Search,
  X,
} from "lucide-react";
import { useAppContext } from "@/context/appContext";
import { FeatureGate } from "@/components/FeatureGate";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Provider, ServiceProvider } from "@/types";
import ImagePicker from "../../components/ImagePicker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/pagination";

interface ProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  isEdit: boolean;
}

type DialogMode = "select" | "manual";

export default function ProviderDialog({
  isOpen,
  onClose,
  provider,
  isEdit,
}: ProviderDialogProps) {
  const [mode, setMode] = useState<DialogMode>("select");
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form states
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [percentage, setPercentage] = useState<number>(0);
  const [checked, setChecked] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: createProvider } = useCreateProvider();
  const { mutate: UpdateProvider } = useUpdateProvider();
  const { data: availableProviders, isLoading: providersLoading } =
    useGetAllServiceProviders(currentPage, pageSize, searchQuery);
  const { storeInfo } = useAppContext();

  // Note: Filtering is now handled by the API, no client-side filtering needed

  // Populate form values on edit
  useEffect(() => {
    if (isEdit && provider) {
      setName(provider.name || "");
      setApiKey("");
      setImage(provider.image || "");
      setUrl(provider.url || "");
      setChecked(provider.sync || false);
      setPercentage(provider.percentage || 0);
      setMode("manual"); // Edit mode always starts in manual
      setSelectedProvider(null);
    } else {
      // Reset for create mode
      setName("");
      setApiKey("");
      setImage("");
      setUrl("");
      setChecked(false);
      setPercentage(0);
      setMode("select");
      setSelectedProvider(null);
      setSearchQuery("");
      setCurrentPage(1);
      setPageSize(10);
    }
  }, [isOpen, isEdit, provider]);

  // Handle provider selection
  const handleProviderSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setName(provider.name);
    setUrl(provider.url);
    setImage(provider.image || "");
  };

  // Handle mode change
  const handleModeChange = (newMode: DialogMode) => {
    setMode(newMode);
    if (newMode === "manual" && selectedProvider) {
      // Keep the selected provider data when switching to manual
      setName(selectedProvider.name);
      setUrl(selectedProvider.url);
      setImage(selectedProvider.image || "");
    } else if (newMode === "select") {
      // Clear form when switching back to select
      setName("");
      setUrl("");
      setImage("");
      setApiKey("");
      setSelectedProvider(null);
      setCurrentPage(1);
      setSearchQuery("");
    }
  };

  // Handle search with debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "select" && !selectedProvider) {
      toast.warning("Please select a provider or switch to manual entry");
      return;
    }

    if (mode === "manual" && (!apiKey || !url || !name)) {
      toast.warning("All fields are required");
      return;
    }

    const providerData = {
      name,
      apiKey: apiKey,
      sync: checked,
      url: url,
      image,
      uid: provider?.uid,
      percentage: checked ? percentage : 0,
    };

    const mutation = isEdit && provider?.uid ? UpdateProvider : createProvider;

    mutation(isEdit ? { ...providerData } : providerData, {
      onSuccess: () => {
        toast.success(
          `Provider ${isEdit ? "updated" : "created"} successfully`
        );
        queryClient.invalidateQueries({ queryKey: ["providers"] });
        onClose();
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to ${isEdit ? "update" : "create"} provider`
        );
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
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
              : "Choose from existing providers or create a custom one."}
          </DialogDescription>
        </DialogHeader>

        {!isEdit && (
          <Tabs
            value={mode}
            onValueChange={(value) => handleModeChange(value as DialogMode)}
            className="w-full"
          >
            <div className="px-6 py-2 border-b bg-muted/30">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="select" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Select Provider
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="select" className="mt-0">
              <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Provider List */}
                {providersLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-muted rounded w-1/3"></div>
                              <div className="h-3 bg-muted rounded w-2/3"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : availableProviders && availableProviders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-2">
                      No providers found
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or switch to manual entry.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableProviders?.map((provider) => (
                      <motion.div
                        key={provider.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedProvider?.id === provider.id
                              ? "ring-2 ring-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleProviderSelect(provider)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 rounded-lg">
                                <AvatarImage
                                  src={provider.image || ""}
                                  alt={provider.name}
                                />
                                <AvatarFallback className="rounded-lg">
                                  <ImageIcon className="h-6 w-6" />
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-sm truncate">
                                    {provider.name}
                                  </h3>
                                  {selectedProvider?.id === provider.id && (
                                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {provider.url}
                                </p>
                              </div>

                              <Badge variant="secondary" className="text-xs">
                                Available
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {availableProviders && availableProviders.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Pagination
                      page={currentPage}
                      pageSize={pageSize}
                      totalItems={availableProviders.length * 5} // Rough estimate, should be replaced with actual total from API
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      pageSizeOptions={[5, 10, 20]}
                    />
                  </div>
                )}

                {selectedProvider && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 rounded-lg">
                        <AvatarImage
                          src={selectedProvider.image || ""}
                          alt={selectedProvider.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          <ImageIcon className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {selectedProvider.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedProvider.url}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manual" className="mt-0">
              <AnimatePresence mode="wait">
                <motion.form
                  onSubmit={handleSubmit}
                  className="px-6 py-4 space-y-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="providerName">Provider Name</Label>
                    <Input
                      id="providerName"
                      placeholder="e.g. Valid Plug"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="url">API URL</Label>
                    <Input
                      id="url"
                      placeholder="https://api.example.com/v2"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>

                  <ImagePicker
                    label="Provider Image"
                    collection="providers"
                    value={image}
                    onChange={(data) => {
                      setImage(data.url);
                    }}
                  />

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      placeholder="Enter provider API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      required
                    />
                  </div>
                  <FeatureGate
                    isAllowed={
                      storeInfo?.features
                        ?.service_syncing_for_social_media_store ?? false
                    }
                    featureLabel="Service syncing"
                    variant="overlay"
                    description="This plan does not include automatic service syncing from providers. Upgrade to sync services automatically."
                  >
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
                  </FeatureGate>
                  {checked && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Label htmlFor="percentage">Sync Percentage</Label>
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
                      Create Provider
                    </Button>
                  </DialogFooter>
                </motion.form>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        )}

        {/* Edit Mode - Always Manual */}
        {isEdit && (
          <AnimatePresence mode="wait">
            <motion.form
              onSubmit={handleSubmit}
              className="px-6 py-4 space-y-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="providerName">Provider Name</Label>
                <Input
                  id="providerName"
                  placeholder="e.g. Valid Plug"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="url">API URL</Label>
                <Input
                  id="url"
                  placeholder="https://api.example.com/v2"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <ImagePicker
                label="Provider Image"
                collection="providers"
                value={image}
                onChange={(data) => {
                  setImage(data.url);
                }}
              />

              <div className="flex flex-col gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  placeholder="Enter provider API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
              </div>

              <FeatureGate
                isAllowed={
                  storeInfo?.features?.service_syncing_for_social_media_store ??
                  false
                }
                featureLabel="Service syncing"
                variant="overlay"
                description="This plan does not include automatic service syncing from providers. Upgrade to sync services automatically."
              >
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
              </FeatureGate>

              {checked && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Label htmlFor="percentage">Sync Percentage</Label>
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
                  Update Provider
                </Button>
              </DialogFooter>
            </motion.form>
          </AnimatePresence>
        )}
      </DialogContent>
    </Dialog>
  );
}
