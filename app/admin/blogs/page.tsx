"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Search, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Blog } from "@/types";
import BlogForm from "./components/BlogForm";
import {
  useCreateblog,
  useDeleteMultipleBlogs,
  useGetBlogs,
  useUpdateBlog,
} from "@/hooks/use-blog";
import DeleteDialog from "../components/DeleteDialog";
import { EmptyState } from "@/components/empty-state";
import Pagination from "@/components/pagination";
import { FeatureGate } from "@/components/FeatureGate";
import { useAppContext } from "@/context/appContext";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const { mutate: createBlog } = useCreateblog();
  const { mutate: updateBlog } = useUpdateBlog();
  const { mutate: deleteMultipleBlogs } = useDeleteMultipleBlogs();
  const { data: storeBlogs } = useGetBlogs();
  const { storeInfo } = useAppContext();
  const isSubscriptionActive = storeInfo?.subscriptionStatus === "ACTIVE";

  useEffect(() => {
    if (storeBlogs) {
      setBlogs(storeBlogs);
    }
  }, [storeBlogs]);

  // Filtered + sorted blogs (consistent with public BlogPage)
  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blogs
      .filter((b) =>
        q === "" ? true : `${b.title} ${b.excerpt}`.toLowerCase().includes(q)
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [blogs, search]);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredBlogs.slice(startIndex, startIndex + pageSize);
  }, [filteredBlogs, page, pageSize]);

  // Create new blog
  const handleCreate = () => {
    const newBlog: Blog = {
      title: "",
      slug: `/new-blog-post-${Date.now()}`,
      excerpt: "",
      content: "",
      coverImage: "https://placehold.co/600x400?text=Blog+Image",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      uid: "",
      id: Date.now(), // temporary unique key for rendering
      storeScopedId: Date.now(),
      status: "ACTIVE",
    };
    setSelectedBlog({ ...newBlog }); // ensure new object reference
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  // Edit existing blog
  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteSingle = (storeScopedId: number) => {
    setDeleteIds([storeScopedId]);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    const usersUids = filteredBlogs
      .filter((u) => deleteIds.includes(u.storeScopedId))
      .map((u) => u.uid);
    deleteMultipleBlogs({ uids: usersUids });
    setBlogs((prev) =>
      prev.filter((u) => !deleteIds.includes(u.storeScopedId))
    );
    setSelected((prev) => prev.filter((id) => !deleteIds.includes(id)));
    setDeleteIds([]);
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    setDeleteIds(selected);
    setDeleteOpen(true);
  };
  // Save (create or update)
  const handleSave = (updated: Blog) => {
    setBlogs((prev) =>
      isEditing
        ? prev.map((b) =>
            b.storeScopedId === updated.storeScopedId ? updated : b
          )
        : [updated, ...prev]
    );

    const mutation = isEditing ? updateBlog : createBlog;
    mutation(
      isEditing
        ? updated
        : {
            title: updated.title,
            slug: updated.slug,
            excerpt: updated.excerpt,
            content: updated.content,
            coverImage: updated.coverImage,
          }
    );
    toast.success(
      isEditing ? "Blog updated successfully" : "Blog created successfully"
    );
    setIsDialogOpen(false);
  };

  const namesForDelete = blogs
    .filter((u) => deleteIds.includes(u.storeScopedId))
    .map((u) => u.title);

  return (
    <main className="max-w-7xl mx-auto">
      {filteredBlogs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Blog Found"
          description="No blog have been created yet."
          actionLabel="Create Blog"
          onAction={handleCreate}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-semibold leading-tight">
                Manage Blogs
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Create, edit, and manage your published posts.
              </p>
            </div>

            <FeatureGate
              isAllowed={isSubscriptionActive}
              featureLabel="Create Blog"
              description="Your subscription is required to create new blogs."
              variant="tooltip"
            >
              <Button onClick={handleCreate} className="gap-2">
                <Plus size={18} /> New Blog
              </Button>
            </FeatureGate>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBlogs.map((blog) => (
              <Card
                key={blog.id}
                className="rounded-2xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={blog.coverImage}
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
                      {format(new Date(blog?.createdAt), "MMM d, yyyy")}
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
                        onClick={() => handleDeleteSingle(blog.storeScopedId)}
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

          {/* Pagination */}
          {filteredBlogs.length > 0 && (
            <div className="mt-8">
              <Pagination
                page={page}
                pageSize={pageSize}
                totalItems={filteredBlogs.length}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[9, 18, 27]}
              />
            </div>
          )}
        </>
      )}
      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-y-auto">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{isEditing ? "Edit Blog" : "Create Blog"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {isEditing
                ? "Update your blog post details below."
                : "Create a new blog post to share with your audience."}
            </DialogDescription>
          </DialogHeader>

          {selectedBlog && (
            <div className="px-6 py-4">
              <BlogForm
                blog={selectedBlog}
                onCancel={() => setIsDialogOpen(false)}
                onSave={handleSave}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete dialog */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        count={deleteIds.length}
        names={namesForDelete}
        entityName="blog"
      />
    </main>
  );
}
