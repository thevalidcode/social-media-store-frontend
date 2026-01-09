"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImagePicker from "../../components/ImagePicker";

interface CategoryFormProps {
  category: { name: string; description: string; icon: string };
  setCategory: (val: any) => void;
}

export default function CategoryForm({
  category,
  setCategory,
}: CategoryFormProps) {
  const handleChange = (key: string, value: any) =>
    setCategory((prev: any) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-3 text-sm mt-2">
      <div className="flex flex-col lg:gap-2 gap-1">
        <Label>Name</Label>
        <Input
          value={category.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Category name"
          required
        />
      </div>
      <div className="flex flex-col lg:gap-2 gap-1">
        <Label>Description</Label>
        <Textarea
          value={category.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Short category description..."
        />
      </div>
      <ImagePicker
        label="Icon"
        collection="categories"
        value={category.icon}
        onChange={(data) => handleChange("icon", data.url)}
      />
    </div>
  );
}
