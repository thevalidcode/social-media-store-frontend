"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Blog } from "@/types";
import BlogForm from "./components/BlogForm";
import { POSTS } from "@/app/_docs/doc";

// -------------------- Component --------------------
export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(POSTS);
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Filtered + sorted blogs (consistent with public BlogPage)
  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blogs
      .filter((b) =>
        q === "" ? true : `${b.title} ${b.excerpt}`.toLowerCase().includes(q)
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [blogs, search]);

  // Create new blog
  const handleCreate = () => {
    const now = new Date().toISOString();
    setSelectedBlog({
      id: Date.now(),
      title: "",
      slug: "/new-blog-post-" + Date.now(),
      excerpt: "",
      content: "",
      status: "active",
      createdAt: now,
      updatedAt: now,
      img: "https://placehold.co/600x400?text=Blog+Image",
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  // Edit existing blog
  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Delete blog
  const handleDelete = (id: number) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    toast.success("Blog deleted successfully");
  };

  // Save (create or update)
  const handleSave = (updated: Blog) => {
    setBlogs((prev) =>
      isEditing
        ? prev.map((b) => (b.id === updated.id ? updated : b))
        : [updated, ...prev]
    );

    toast.success(
      isEditing ? "Blog updated successfully" : "Blog created successfully"
    );
    setIsDialogOpen(false);
  };

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Manage Blogs</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create, edit, and manage your published posts.
          </p>
        </div>

        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} /> New Blog
        </Button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <Label htmlFor="search" className="sr-only">
          Search blogs
        </Label>
        <div className="flex gap-2 w-full sm:w-96 relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search blogs by title or excerpt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <Button variant="ghost" onClick={() => setSearch("")}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Blog List */}
      {filteredBlogs.length === 0 ? (
        <div className="py-12 text-center text-gray-600">No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="rounded-2xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-44 object-cover"
                  loading="lazy"
                />
              </div>

              <CardContent className="flex flex-col gap-3 p-4">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {blog.title || "Untitled Blog"}
                  </CardTitle>
                </CardHeader>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {blog.excerpt || "No excerpt available"}
                </p>

                <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                  <time dateTime={blog.createdAt}>
                    {format(new Date(blog.createdAt), "MMM d, yyyy")}
                  </time>

                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(blog)}
                      aria-label={`Edit ${blog.title}`}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(blog.id)}
                      aria-label={`Delete ${blog.title}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Blog" : "Create Blog"}</DialogTitle>
          </DialogHeader>

          {selectedBlog && (
            <BlogForm
              blog={selectedBlog}
              onCancel={() => setIsDialogOpen(false)}
              onSave={handleSave}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
