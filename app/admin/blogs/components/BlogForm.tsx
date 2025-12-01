"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import WysiwygEditor from "@/components/WysiwygEditor";
import { Blog } from "@/types";
import ImagePicker from "../../components/ImagePicker";

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
      <ImagePicker
        label="Image"
        collection="blogs"
        value={img}
        onChange={(data) => {
          setImg(data.url);
        }}
      />

      {/* WYSIWYG Editor */}
      <div className="space-y-2">
        <Label>Content</Label>
        <WysiwygEditor
          key={blog.uid || "new"}
          initialContent={content}
          onChange={setContent}
          collection="blogs"
          className="min-h-[420px]"
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
