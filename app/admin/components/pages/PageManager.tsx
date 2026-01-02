"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WysiwygEditor from "@/components/WysiwygEditor";
import {
  useGetPagesByAdmin,
  useCreatePage,
  useUpdatePage,
} from "@/hooks/use-pages";
import { Page, PageType } from "@/types";
import { FileText, Save, Eye } from "lucide-react";
import { TypographyH3 } from "@/components/typography";
import parse from "html-react-parser";
import Loading from "@/app/loading";

const PAGE_TYPES: { value: PageType; label: string; description: string }[] = [
  {
    value: "SERVICES",
    label: "Services Page",
    description: "Content shown on services page",
  },
  {
    value: "ORDERS",
    label: "Orders Page",
    description: "Content shown on orders page",
  },
  {
    value: "ORDER",
    label: "Order Terms of Service",
    description: "Terms shown during order placement",
  },
  {
    value: "TERMS_OF_SERVICE",
    label: "Terms of Service",
    description: "Full terms of service page",
  },
  {
    value: "PRIVACY_POLICY",
    label: "Privacy Policy",
    description: "Full privacy policy page",
  },
] as const;

export default function PageManager() {
  const [selectedType, setSelectedType] = useState<PageType>("SERVICES");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  const { data: pages, isLoading } = useGetPagesByAdmin();
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();

  useEffect(() => {
    if (pages && selectedType) {
      const page = pages.find((p) => p.pageType === selectedType);
      if (page) {
        setCurrentPage(page);
        setContent(page.content || "");
        setTitle(page.title || "");
      } else {
        setCurrentPage(null);
        setContent("");
        const defaultTitle =
          PAGE_TYPES.find((t) => t.value === selectedType)?.label || "";
        setTitle(defaultTitle);
      }
    }
  }, [selectedType, pages]);

  const handleSave = async () => {
    if (currentPage) {
      // Update existing page
      await updatePage.mutateAsync({
        uid: currentPage.uid,
        title,
        content,
      });
    } else {
      // Create new page
      await createPage.mutateAsync({
        pageType: selectedType as any,
        title,
        content,
      });
    }
  };

  const selectedTypeInfo = PAGE_TYPES.find((t) => t.value === selectedType);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <TypographyH3 className="mb-2">Page Content Manager</TypographyH3>
        <p className="text-sm text-muted-foreground">
          Manage custom content for different pages across your store
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Select Page</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between ">
              <Label>Page Type</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as PageType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a page type" />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTypeInfo && (
              <p className="text-xs text-muted-foreground">
                {selectedTypeInfo.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">
            <FileText className="h-4 w-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <WysiwygEditor
                collection="pages"
                initialContent={content}
                placeholder="Write your page content here..."
                onChange={(html) => setContent(html)}
                className="min-h-[400px]"
              />

              <div className="flex justify-end gap-3">
                <Button onClick={handleSave} disabled={!content.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  {currentPage ? "Update Page" : "Create Page"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                This is how your content will appear to users
              </p>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert">
                {content ? (
                  parse(content)
                ) : (
                  <p className="text-muted-foreground text-center py-12">
                    No content to preview. Switch to the editor tab to create
                    content.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
