"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import WysiwygEditor from "@/components/WysiwygEditor";
import { Blog } from "@/types";
import { Image } from "lucide-react";
import { useUploadImage } from "@/hooks/use-file";
import { PreviousImagesSelector } from "../../components/PreviousImagesSelector";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface BlogFormProps {
  blog: Blog;
  onSave: (blog: Blog) => void;
  onCancel: () => void;
}

export default function BlogForm({ blog, onSave, onCancel }: BlogFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const { mutateAsync: uploadImage } = useUploadImage();

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setSlug(blog.slug || "");
      setExcerpt(blog.excerpt || "");
      setContent(blog.content || "");
      setImg(blog.coverImage || "");
    }
  }, [blog]);

  // ✅ Auto-generate slug from title
  useEffect(() => {
    if (title.trim()) {
      const generatedSlug =
        "/" +
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  }, [title]);

  const handleSubmit = () => {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    const updated: Blog = {
      ...blog,
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: img.trim() || "https://placehold.co/600x400?text=Blog+Image",
    };

    onSave(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const response = await uploadImage({ file, collection: "blogs" });
    setImg(response.url);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-5"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter blog title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={slug} disabled />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          placeholder="Short summary of the blog..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="min-h-[90px]"
        />
      </div>

      {/* Image */}
      <div className="flex flex-col lg:gap-2 gap-1">
        <Label htmlFor="provideImage">Image</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e)}
          />
          <Image className="w-5 h-5 text-muted-foreground" />
        </div>
        <Dialog>
          <DialogTrigger>Choose Previous Image</DialogTrigger>
          <PreviousImagesSelector
            collection="blogs"
            onSelect={(img) => {
              setImg(img.url);
            }}
          />
        </Dialog>
      </div>

      {/* WYSIWYG Editor */}
      <div className="space-y-2">
        <Label>Content</Label>
        <WysiwygEditor
          key={blog.uid || "new"}
          initialContent={content}
          onChange={setContent}
          collection="blogs"
          className="h-[420px]"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {blog?.id ? "Save Changes" : "Create Blog"}
        </Button>
      </div>
    </form>
  );
}
