"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Image as ImageIcon, Import } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ImportServicesDialog from "./ImportServicesDialog";
import { useCreateCategory, useGetCategories } from "@/hooks/use-category";
import Loading from "@/app/loading";
import { useGetProviders } from "@/hooks/use-providers";
import { useCreateService } from "@/hooks/use-services";
import { useAppContext } from "@/context/appContext";
import { useUploadImage } from "@/hooks/use-file";
import Image from "next/image";
import { PreviousImagesSelector } from "../../components/PreviousImagesSelector";

interface SelectType {
  value: string;
  label: string;
  image?: string;
}

const syncOptions = [
  { key: "syncQuantity", label: "Sync Quantity" },
  { key: "syncCatAndName", label: "Sync Category & Name" },
  { key: "dripFeed", label: "Drip Feed" },
  { key: "refill", label: "Refill" },
  { key: "cancel", label: "Cancel" },
];

function CategoryForm({ newCategory, setNewCategory, handleFileUpload }: any) {
  const handleChange = (key: string, value: any) =>
    setNewCategory((prev: any) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-3 text-sm mt-2">
      <div>
        <Label>Name</Label>
        <Input
          value={newCategory.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Category name"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={newCategory.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Short category description..."
        />
      </div>
      <div>
        <Label>Icon</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "categories")}
          />
          <ImageIcon className="w-5 h-5 text-muted-foreground" />
        </div>
        <Dialog>
          <DialogTrigger>Choose Previous Image</DialogTrigger>
          <PreviousImagesSelector
            collection="categories"
            onSelect={(img) => {
              setNewCategory({ ...newCategory, icon: img.url });
            }}
          />
        </Dialog>
      </div>
    </div>
  );
}

function ServiceForm({
  newService,
  setNewService,
  categoryOptions,
  providerOptions,
  handleFileUpload,
}: any) {
  const handleChange = (key: string, value: any) =>
    setNewService((prev: any) => ({ ...prev, [key]: value }));

  const showProviderFields = newService.type !== "MANUAL";

  return (
    <div className="space-y-3 text-sm mt-2">
      <div className="flex justify-between items-center">
        <Label>Add Service Details</Label>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <Import className="w-4 h-4" /> Import from Provider
        </Button>
      </div>

      <InputField
        label="Name"
        value={newService.name}
        onChange={(v) => handleChange("name", v)}
      />

      <SelectField
        label="Category"
        options={categoryOptions}
        value={newService.category}
        onChange={(v) => handleChange("category", v)}
        showImage
      />

      <FileInputField
        label="Icon"
        onChange={(e) => handleFileUpload(e, "services")}
      />
      <Dialog>
        <DialogTrigger>Choose Previous Image</DialogTrigger>
        <PreviousImagesSelector
          collection="services"
          onSelect={(img) => {
            setNewService({ ...newService, icon: img.url });
          }}
        />
      </Dialog>
      <TextareaField
        label="Description"
        value={newService.description}
        onChange={(v) => handleChange("description", v)}
      />
      <SelectField
        label="Type"
        options={[
          "MANUAL",
          "DEFAULT",
          "PACKAGE",
          "SEO",
          "CUSTOM_COMMENTS",
          "MENTIONS",
          "MENTIONS_WITH_HASHTAGS",
          "MENTIONS_CUSTOM_LIST",
          "MENTIONS_HASHTAG",
          "MENTIONS_USER_FOLLOWERS",
          "MENTIONS_MEDIA_LIKERS",
          "CUSTOM_COMMENTS_PACKAGE",
          "COMMENT_LIKES",
          "POLL",
          "COMMENT_REPLIES",
          "SUBSCRIPTIONS",
          "INVITES_FROM_GROUPS",
        ].map((t) => ({ value: t, label: t.replace(/_/g, " ") }))}
        value={newService.type}
        onChange={(v) => handleChange("type", v)}
      />

      {showProviderFields && (
        <>
          <SelectField
            label="Provider"
            options={providerOptions}
            value={newService.providerUid}
            onChange={(v) => handleChange("providerUid", v)}
            showImage
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Min"
              type="number"
              value={newService.min}
              onChange={(v) => handleChange("min", Number(v))}
              disabled={newService.type === "PACKAGE"}
            />
            <InputField
              label="Max"
              type="number"
              value={newService.max}
              onChange={(v) => handleChange("max", Number(v))}
              disabled={newService.type === "PACKAGE"}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Provider Service ID"
              type="number"
              value={newService.providerId}
              onChange={(v) => handleChange("providerId", Number(v))}
            />
            <InputField
              label="Provider Price"
              type="number"
              value={newService.providerPrice}
              disabled
            />
            <InputField
              label="Network"
              value={newService.network}
              onChange={(v) => handleChange("network", v)}
            />
            <InputField
              label="Refill Days"
              type="number"
              value={newService.refillDays}
              onChange={(v) => handleChange("refillDays", Number(v))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {syncOptions.map((opt) => (
              <div
                key={opt.key}
                className="flex items-center justify-between border p-2 rounded-md"
              >
                <Label>{opt.label}</Label>
                <Switch
                  checked={newService[opt.key]}
                  onCheckedChange={(v) => handleChange(opt.key, v)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: "text" | "number" | "password" | "email";
  disabled?: boolean;
}

export const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: InputFieldProps) => (
  <div>
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        onChange?.(e.target.value)
      }
      disabled={disabled}
    />
  </div>
);

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextareaField = ({
  label,
  value,
  onChange,
}: TextareaFieldProps) => (
  <div>
    <Label>{label}</Label>
    <Textarea
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        onChange(e.target.value)
      }
    />
  </div>
);

interface FileInputFieldProps {
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FileInputField = ({ label, onChange }: FileInputFieldProps) => (
  <div>
    <Label>{label}</Label>
    <div className="flex items-center gap-2">
      <Input type="file" accept="image/*" onChange={onChange} />
      <ImageIcon className="w-5 h-5 text-muted-foreground" />
    </div>
  </div>
);

export interface SelectOption {
  value: string;
  label: string;
  image?: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  showImage?: boolean;
}

export const SelectField = ({
  label,
  options,
  value,
  onChange,
  showImage = false,
}: SelectFieldProps) => (
  <div>
    <Label>{label}</Label>
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt, key) => (
          <SelectItem key={key} value={opt.value}>
            {showImage && opt.image && (
              <Image
                src={opt.image}
                alt={opt.label}
                width={20}
                height={20}
                className="inline rounded-sm object-cover"
              />
            )}
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default function AddButton() {
  const [open, setOpen] = useState(false);
  const [isCategoryMode, setIsCategoryMode] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectType[]>([]);
  const [providerOptions, setProviderOptions] = useState<SelectType[]>([]);
  const { userCurrency } = useAppContext();

  const [newService, setNewService] = useState({
    type: "PACKAGE",
    currency: userCurrency,
    min: 1,
    max: 1,
    providerUid: "",
    providerId: 0,
    providerPrice: 1,
    network: "",
    refillDays: 0,
    syncQuantity: true,
    syncCatAndName: true,
    dripFeed: true,
    refill: true,
    cancel: true,
    name: "",
    category: "",
    description: "",
    icon: "",
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const { data: categoryData, isLoading: isCategoriesLoading } =
    useGetCategories();
  const { data: providerData, isLoading: isProviderLoading } =
    useGetProviders();
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: createService } = useCreateService();
  const { mutateAsync: uploadImage } = useUploadImage();

  useEffect(() => {
    if (categoryData)
      setCategoryOptions(
        categoryData.map((c) => ({
          value: c.name,
          label: c.name,
          image: c.icon,
        }))
      );
  }, [categoryData]);

  useEffect(() => {
    if (providerData)
      setProviderOptions(
        providerData.map((p) => ({
          value: p.uid,
          label: p.name,
          image: p.image,
        }))
      );
  }, [providerData]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "services" | "categories"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const response = await uploadImage({ file, collection: type });
    if (type === "services")
      setNewService((prev) => ({ ...prev, icon: response.url }));
    else setNewCategory((prev) => ({ ...prev, icon: response.url }));
  };

  const handleSave = () => {
    if (isCategoryMode) createCategory(newCategory);
    else createService(newService);
    setOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-primary text-primary-foreground p-4 hover:scale-105 transition"
        whileTap={{ scale: 0.95 }}
      >
        <PlusCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              {isCategoriesLoading || isProviderLoading ? (
                <Loading />
              ) : (
                <>
                  <DialogHeader className="flex flex-row mt-5 justify-between items-center">
                    <DialogTitle>
                      {isCategoryMode ? "Add New Category" : "Add New Service"}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="switch-mode" className="text-xs">
                        Category
                      </Label>
                      <Switch
                        id="switch-mode"
                        checked={isCategoryMode}
                        onCheckedChange={setIsCategoryMode}
                      />
                    </div>
                  </DialogHeader>

                  {isCategoryMode ? (
                    <CategoryForm
                      newCategory={newCategory}
                      setNewCategory={setNewCategory}
                      handleFileUpload={handleFileUpload}
                    />
                  ) : (
                    <ServiceForm
                      newService={newService}
                      setNewService={setNewService}
                      categoryOptions={categoryOptions}
                      providerOptions={providerOptions}
                      handleFileUpload={handleFileUpload}
                    />
                  )}

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      {isCategoryMode ? "Add Category" : "Add Service"}
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <ImportServicesDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
