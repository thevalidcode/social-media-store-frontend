"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import WysiwygEditor from "@/components/WysiwygEditor";
import { Blog } from "@/types";

interface BlogFormProps {
  blog: Blog;
  onSave: (blog: Blog) => void;
  onCancel: () => void;
}

export default function BlogForm({ blog, onSave, onCancel }: BlogFormProps) {
  const [title, setTitle] = useState(blog.title || "");
  const [excerpt, setExcerpt] = useState(blog.excerpt || "");
  const [content, setContent] = useState(blog.content || "");
  const [img, setImg] = useState(blog.img || "");

  const handleSubmit = () => {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    const now = new Date().toISOString();
    const updated: Blog = {
      ...blog,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      img: img.trim() || "https://placehold.co/600x400?text=Blog+Image",
      updatedAt: now,
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

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="img">Image URL</Label>
        <Input
          id="img"
          placeholder="https://example.com/cover-image.jpg"
          value={img}
          onChange={(e) => setImg(e.target.value)}
        />
      </div>

      {/* WYSIWYG Editor */}
      <div className="space-y-2">
        <Label>Content</Label>
        <WysiwygEditor
          initialContent={content}
          onChange={setContent}
          collection="blogs"
          className="h-[420px]"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {blog.id ? "Save Changes" : "Create Blog"}
        </Button>
      </div>
    </form>
  );
}
