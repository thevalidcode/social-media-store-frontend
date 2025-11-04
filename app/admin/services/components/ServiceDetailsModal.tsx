"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Service } from "@/types";
import { Switch } from "@/components/ui/switch";
import { ImageIcon } from "lucide-react";
import { useGetProviders } from "@/hooks/use-providers";
import Loading from "@/app/loading";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { useUpdateService } from "@/hooks/use-services";

interface ServiceDetailsModalProps {
  service: Service;
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onEdit: (service: Service) => void;
}

interface SelectType {
  value: string;
  label: string;
}
export default function ServiceDetailsModal({
  service,
  isOpen,
  onClose,
  onEdit,
  isEditing,
}: ServiceDetailsModalProps) {
  const [formData, setFormData] = useState(service);
  const [providerOptions, setProviderOptions] = useState<SelectType[]>([]);
  const { data: providerData, isLoading: isProviderLoading } =
    useGetProviders();
  const { mutate: updateService } = useUpdateService();

  const convert = useCurrencyConverter();
  const { userCurrency } = useAppContext();

  useEffect(() => {
    if (providerData) {
      const mappedProviders = providerData.map((provider) => ({
        value: provider.uid,
        label: provider.name,
      }));
      setProviderOptions(mappedProviders);
    }
  }, [providerData]);

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (service: Service) => {
    onEdit(service);
    updateService(service);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-lg">
            {isProviderLoading ? (
              <Loading />
            ) : (
              <>
                {" "}
                <DialogHeader>
                  <DialogTitle className="flex justify-between items-center">
                    {formData.name}
                    <Badge
                      variant={
                        formData.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {formData.status}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 text-sm"
                >
                  {isEditing ? (
                    <form className="space-y-3 text-sm">
                      <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Input
                          value={formData.category}
                          onChange={(e) =>
                            handleChange("category", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label>Type</Label>
                        <Select
                          onValueChange={(v) => handleChange("type", v)}
                          value={formData.type}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PACKAGE">Package</SelectItem>
                            <SelectItem value="DEFAULT">Default</SelectItem>
                            <SelectItem value="SUBSCRIPTION">
                              Subscription
                            </SelectItem>
                            <SelectItem value="CUSTOMCOMMENTS">
                              Custom Comments
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Provider</Label>
                        <Select
                          onValueChange={(v) => handleChange("providerUid", v)}
                          value={formData.provider?.uid}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {providerOptions.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Min</Label>
                          <Input
                            type="number"
                            value={formData.min}
                            onChange={(e) =>
                              handleChange("min", Number(e.target.value))
                            }
                            className="w-full"
                            disabled={formData.type === "PACKAGE"}
                          />
                        </div>
                        <div>
                          <Label>Max</Label>
                          <Input
                            type="number"
                            value={formData.max}
                            onChange={(e) =>
                              handleChange("max", Number(e.target.value))
                            }
                            className="w-full"
                            disabled={formData.type === "PACKAGE"}
                          />
                        </div>
                      </div>

                      {formData.provider?.name !== "" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Provider Service ID</Label>
                            <Input
                              type="number"
                              value={formData.providerId}
                              onChange={(e) =>
                                handleChange(
                                  "providerId",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label>Provider Price</Label>
                            <Input
                              type="string"
                              value={
                                convert(
                                  service.currency,
                                  userCurrency,
                                  service.providerPrice || "",
                                  true,
                                  true
                                ).formatted
                              }
                              disabled
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label>Network</Label>
                            <Input
                              value={formData.network!}
                              onChange={(e) =>
                                handleChange("network", e.target.value)
                              }
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label>Refill Days</Label>
                            <Input
                              type="number"
                              value={formData.refillDays}
                              onChange={(e) =>
                                handleChange(
                                  "refillDays",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: "syncQuantity", label: "Sync Quantity" },
                          {
                            key: "syncCatAndName",
                            label: "Sync Category & Name",
                          },
                          { key: "dripFeed", label: "Drip Feed" },
                          { key: "refill", label: "Refill" },
                          { key: "cancel", label: "Cancel" },
                        ]
                          .filter((item) =>
                            formData.provider?.name !== ""
                              ? item.key !== "syncCatAndName" &&
                                item.key !== "syncQuantity"
                              : true
                          )
                          .map((item) => (
                            <div
                              key={item.key}
                              className="flex items-center justify-between border p-2 rounded-md"
                            >
                              <Label>{item.label}</Label>
                              <Switch
                                checked={(formData as any)[item.key]}
                                onCheckedChange={(v) =>
                                  handleChange(item.key as any, v)
                                }
                              />
                            </div>
                          ))}
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
                          placeholder="Describe the service..."
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label>Icon</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e)}
                            className="w-full"
                          />
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <strong>Category:</strong> {formData.category}
                      </p>
                      <p>
                        <strong>Type:</strong> {formData.type}
                      </p>
                      <p>
                        <strong>Price:</strong>{" "}
                        {
                          convert(
                            formData.currency,
                            userCurrency,
                            formData.price || "",
                            true,
                            true
                          ).formatted
                        }
                      </p>
                      <p>
                        <strong>Range:</strong> {formData.min} - {formData.max}
                      </p>
                      {formData.description && (
                        <p>
                          <strong>Description:</strong> {formData.description}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                    {isEditing ? (
                      <Button onClick={() => handleSave(service)}>Save</Button>
                    ) : (
                      <Button onClick={() => onEdit(service)}>Edit</Button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
