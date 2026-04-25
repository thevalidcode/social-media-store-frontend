"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImagePicker from "../../components/ImagePicker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface CategoryFormProps {
  category: { name: string; description: string; icon: string };
  setCategory: (val: any) => void;
  isEditing?: boolean;
}

export default function CategoryForm({
  category,
  isEditing,
  setCategory,
}: CategoryFormProps) {
  const handleChange = (key: string, value: any) =>
    setCategory((prev: any) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5 text-sm">
      {!isEditing && (
        <Card className="border-dashed bg-muted/20 shadow-none">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    Category setup
                  </Badge>
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Simple and clear
                  </span>
                </div>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Keep category names, descriptions, and icons readable and easy
                  to edit on every device.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="gap-0 py-0 shadow-sm">
        <CardHeader className="space-y-2 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              01
            </Badge>
            <CardTitle className="text-base">Category details</CardTitle>
          </div>
          <CardDescription>
            The name and description are the main fields users will see.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 sm:px-6">
          <div className="flex flex-col gap-1 lg:gap-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              value={category.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Category name"
              required
            />
          </div>

          <div className="flex flex-col gap-1 lg:gap-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              value={category.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Short category description..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 shadow-sm">
        <CardHeader className="space-y-2 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              02
            </Badge>
            <CardTitle className="text-base">Visual identity</CardTitle>
          </div>
          <CardDescription>
            Add an icon so the category stands out in compact lists.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5 sm:px-6">
          <ImagePicker
            label="Icon"
            collection="categories"
            value={category.icon}
            onChange={(data) => handleChange("icon", data.url)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
