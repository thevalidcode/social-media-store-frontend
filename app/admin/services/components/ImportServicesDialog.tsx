"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2 } from "lucide-react";
import {
  useGetProviders,
  useGetProviderServices,
  useImportProviderServices,
} from "@/hooks/use-providers";
import Loading from "@/app/loading";
import { ProviderService } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCategories } from "@/hooks/use-category";

interface ImportServicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SelectType {
  value: string;
  label: string;
}

interface ProviderServiceExtra extends ProviderService {
  provider: string;
}

export default function ImportServicesDialog({
  open,
  onOpenChange,
}: ImportServicesDialogProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [step, setStep] = useState(1);
  const [providerOptions, setProviderOptions] = useState<SelectType[]>([]);
  const [providerServices, setProviderServices] = useState<
    ProviderServiceExtra[]
  >([]);
  const [markup, setMarkup] = useState(0);
  const [progress, setProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sameCategory, setSameCategory] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<SelectType[]>([]);

  const convert = useCurrencyConverter();
  const { userCurrency, storeId } = useAppContext();
  const queryClient = useQueryClient();

  const { data: providerData, isLoading: isProviderLoading } =
    useGetProviders();

  const {
    data: providerServicesData = [],
    isLoading: isProviderServicesLoading,
  } = useGetProviderServices(selectedProvider || undefined);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategories();

  const importMutation = useImportProviderServices();

  const itemsPerPage = 100;

  useEffect(() => {
    if (providerData) {
      const mappedProviders = providerData.map((provider) => ({
        value: provider.url,
        label: provider.name,
      }));
      setProviderOptions(mappedProviders);
    }
  }, [providerData]);

  useEffect(() => {
    const fetchProviderServices = async () => {
      if (!selectedProvider) return;

      try {
        if (providerServicesData && providerServicesData?.length > 0) {
          const mappedServices = providerServicesData.map((service) => ({
            ...service,
            provider: selectedProvider,
          }));
          setProviderServices(mappedServices);
        }
      } catch (error) {
        console.error("Error fetching provider services:", error);
      }
    };

    fetchProviderServices();
  }, [selectedProvider, providerServicesData]);

  useEffect(() => {
    if (categoriesData && selectedCategory) {
      const mappedCategorys = categoriesData.map((category) => ({
        value: category.name,
        label: category.name,
      }));
      setCategories(mappedCategorys);
    }
  }, [categoriesData, selectedCategory]);

  useEffect(() => {
    if (importMutation.isPending) setProgress(50);
    if (importMutation.isSuccess) setProgress(100);
    if (importMutation.isError) setProgress(0);
  }, [importMutation.status]);

  const filteredServices = providerServices.filter(
    (s) =>
      (!selectedProvider || s.provider === selectedProvider) &&
      s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Select all services (filtered or full)
  const handleSelectAll = () => {
    const targetIds = filteredServices.map((s) => s.service);
    const allSelected = targetIds.every((id) => selected.includes(id));

    if (allSelected) {
      // Unselect all
      setSelected((prev) => prev.filter((id) => !targetIds.includes(id)));
    } else {
      // Select all
      setSelected((prev) => Array.from(new Set([...prev, ...targetIds])));
    }
  };

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleImport = async () => {
    setStep(3);
    setImporting(true);
    setProgress(0);

    importMutation.mutate(
      {
        providerServicesId: selected,
        importPercent: markup,
        category: {
          value: sameCategory ? "createSameCategory" : selectedCategory,
          label: sameCategory ? "Create Same Category" : selectedCategory,
        },
        provider: selectedProvider || "",
      },
      {
        onSuccess: () => {
          setProgress(100);
          setTimeout(() => {
            setImporting(false);
          }, 400);
        },
        onError: () => {
          setImporting(false);
          setProgress(0);
        },
        onSettled: () => {
          // optional cleanup or toast notification
          setImporting(false);
          setProgress(0);
          queryClient.invalidateQueries({
            queryKey: ["servicesByAdmin", storeId],
          });
        },
      },
    );
  };

  const handleClose = () => {
    setStep(1);
    setSelected([]);
    setMarkup(0);
    setSelectedProvider("");
    setProviderServices([]);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          // This runs only when the dialog closes
          handleClose();
        }
        onOpenChange(isOpen); // still call the parent handler
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            Import Services from Provider
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Import services from your connected providers to expand your
            catalog.
          </DialogDescription>
        </DialogHeader>

        {isProviderLoading ||
        isProviderServicesLoading ||
        isCategoriesLoading ? (
          <div className="px-6 py-4">
            <Loading />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-6 py-4 space-y-5"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Select Provider
                  </Label>
                  <Select
                    value={selectedProvider || ""}
                    onValueChange={(value) => setSelectedProvider(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providerOptions.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search provider services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="checkbox"
                    checked={
                      filteredServices.length > 0 &&
                      filteredServices.every((s) =>
                        selected.includes(s.service),
                      )
                    }
                    onChange={handleSelectAll}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="flex items-center gap-2"
                  >
                    Select All
                  </Button>
                </div>
                <div className="max-h-[300px] overflow-y-auto rounded-lg border bg-background">
                  {paginatedServices.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground text-sm">
                      No services found for this provider
                    </div>
                  ) : (
                    paginatedServices.map((s) => (
                      <div
                        key={s.service}
                        className={`flex justify-between items-center px-3 py-3 cursor-pointer transition border-b last:border-0 ${
                          selected.includes(s.service)
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleSelect(s.service)}
                      >
                        <div>
                          <p className="font-medium text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.category} • {s.provider}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Price:{" "}
                            <span className="font-medium">
                              {
                                convert(
                                  s.currency,
                                  userCurrency,
                                  s.rate,
                                  true,
                                  true,
                                ).formatted
                              }
                            </span>
                          </p>
                        </div>
                        <Input
                          type="checkbox"
                          checked={selected.includes(s.service)}
                          readOnly
                          className="accent-primary w-4 h-4 cursor-pointer"
                        />
                      </div>
                    ))
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-between items-center pt-3 text-sm text-muted-foreground">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={selected.length === 0 || !selectedProvider}
                  >
                    Next
                  </Button>
                </DialogFooter>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-6 py-4 space-y-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Create Same Category
                  </Label>
                  <Switch
                    checked={sameCategory}
                    onCheckedChange={setSameCategory}
                  />
                </div>
                {!sameCategory && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Select Category
                    </Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => setSelectedCategory(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Set Markup Percentage
                  </Label>
                  <Input
                    type="number"
                    value={markup}
                    onChange={(e) => setMarkup(Number(e.target.value))}
                    placeholder="Enter % increase (e.g., 10)"
                  />
                </div>
                <div className="max-h-[220px] overflow-y-auto border rounded-lg p-2 mt-3 bg-background">
                  {selected.map((id) => {
                    const svc = filteredServices.find((s) => s.service === id);
                    if (!svc) return null;
                    const rate = parseFloat(svc.rate);
                    const newPrice = rate + (rate * markup) / 100;

                    return (
                      <div
                        key={svc.service}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm">{svc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {svc.category} • {svc.provider}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          <p>
                            Old:{" "}
                            {
                              convert(
                                svc.currency,
                                userCurrency,
                                svc.rate,
                                true,
                                true,
                              ).formatted
                            }
                          </p>
                          <p className="font-semibold text-primary">
                            New:{" "}
                            {
                              convert(
                                svc.currency,
                                userCurrency,
                                newPrice,
                                true,
                                true,
                              ).formatted
                            }
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleImport}>Import</Button>
                </DialogFooter>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-6 py-4 space-y-5"
              >
                {importMutation.isError ? (
                  <p className="text-sm text-red-500">
                    {importMutation.error?.message || "Import failed."}
                  </p>
                ) : importing ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Importing selected services...
                    </p>
                    <Progress value={progress} className="w-full" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                    <p className="text-sm font-medium">
                      Services imported successfully!
                    </p>
                    <DialogFooter>
                      <Button onClick={handleClose}>Done</Button>
                    </DialogFooter>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </DialogContent>
    </Dialog>
  );
}
