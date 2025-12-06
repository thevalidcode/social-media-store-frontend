"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGetBlogById } from "@/hooks/use-blog";
import Loading from "@/app/loading";
import { DateTime } from "@/lib/DateTime";
import parse from "html-react-parser";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: post, isLoading } = useGetBlogById(Number(id));

  if (isLoading) {
    return <Loading />;
  }

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
        <Button variant="outline" onClick={() => router.push("/client/blog")}>
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
            Published {post.createdAt && <DateTime date={post.createdAt} />}
          </p>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-72 object-cover rounded-xl shadow-md"
            loading="lazy"
          />
        </header>

        {/* Content Section */}
        <div className="text-sm text-muted-foreground">
          {parse(post.content || "")}
        </div>

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
