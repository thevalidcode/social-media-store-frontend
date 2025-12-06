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
import { useCreateProvider, useUpdateProvider } from "@/hooks/use-providers";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Provider } from "@/types";
import ImagePicker from "../../components/ImagePicker";

interface ProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  isEdit: boolean;
}
export default function ProviderDialog({
  isOpen,
  onClose,
  provider,
  isEdit,
}: ProviderDialogProps) {
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [percentage, setPercentage] = useState<number>(0);
  const [checked, setChecked] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: createProvider } = useCreateProvider();
  const { mutate: UpdateProvider } = useUpdateProvider();

  // Populate form values on edit
  useEffect(() => {
    if (isEdit && provider) {
      setName(provider.name || "");
      setApiKey("");
      setImage(provider.image || "");
      setUrl(provider.url || "");
      setChecked(provider.sync || false);
      setPercentage(provider.percentage || 0);
    } else {
      setName("");
      setApiKey("");
      setImage("");
      setUrl("");
      setChecked(false);
      setPercentage(0);
    }
  }, [isOpen, isEdit, provider]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!apiKey || !url || !name) {
      toast.warning("all fields are required ");
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
            <div className="flex flex-col lg:gap-2 gap-1">
              <Label htmlFor="providerName">Provider Name</Label>
              <Input
                id="providerName"
                placeholder="e.g. Valid Plug"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col lg:gap-2 gap-1">
              <Label htmlFor="url">Url</Label>
              <Input
                id="url"
                placeholder="validplug.com.ng/api/v2"
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
            {/* API Key Field */}
            <div className="flex flex-col lg:gap-2 gap-1">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                placeholder="Enter provider API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
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
