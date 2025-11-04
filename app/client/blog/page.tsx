"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";

// shadcn/ui components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useGetBlogs } from "@/hooks/use-blog";
import Loading from "@/app/loading";
import { EmptyState } from "@/components/empty-state";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
  const [query, setQuery] = useState<string>("");
  const { data, isLoading } = useGetBlogs();

  // Optimized search + filter + sort
  const posts = useMemo(() => {
    if (!data) return [];

    const q = query.trim().toLowerCase();

    return data
      .filter((p) => {
        if (p.status !== "ACTIVE") return false; // show only active posts
        if (!q) return true;
        return `${p.title} ${p.excerpt}`.toLowerCase().includes(q);
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [query, data]);

  if (isLoading) return <Loading />;

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Blog Found"
        description="No blog has been created yet."
      />
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold leading-tight">Blog</h1>
            <p className="text-sm mt-1">
              Latest articles, updates, and short reads.
            </p>
          </div>

          <div className="w-full sm:w-96">
            <Label htmlFor="search" className="sr-only">
              Search posts
            </Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Search by title or excerpt..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
                aria-label="Search posts"
              />
              <Button
                variant="ghost"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="posts-heading">
        <h2 id="posts-heading" className="sr-only">
          Blog posts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.32, delay: idx * 0.06 }}
              className="rounded-2xl overflow-hidden"
            >
              <Card className="h-full group hover:shadow-2xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                </div>

                <CardContent className="flex flex-col gap-3 p-4">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <p className="text-sm line-clamp-3">{post.excerpt}</p>

                  <div className="mt-auto flex items-center justify-between text-xs">
                    <time dateTime={post.createdAt}>
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </time>
                    <Link
                      href={`/client/blog/${post.slug}`}
                      className="text-sm font-medium text-primary-600 transition-colors hover:underline"
                      aria-label={`Read more about ${post.title}`}
                    >
                      Read more
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
