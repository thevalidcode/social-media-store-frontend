"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { POSTS } from "@/app/_docs/doc";
import { Button } from "@/components/ui/button";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const post = useMemo(() => POSTS.find((p) => p.slug === slug), [slug]);

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
        <Button variant="outline" onClick={() => router.push("/blog")}>
          Back to Blog
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <motion.article
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-sm mb-4">
            Published on {format(new Date(post.createdAt), "MMMM d, yyyy")}
          </p>
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-72 object-cover rounded-xl shadow-md"
            loading="lazy"
          />
        </header>

        {/* Content Section */}
        <section
          className="prose prose-gray max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <div className="mt-10">
          <Button variant="outline" onClick={() => router.push("/client/blog")}>
            ← Back to Blog
          </Button>
        </div>
      </motion.article>
    </main>
  );
}
