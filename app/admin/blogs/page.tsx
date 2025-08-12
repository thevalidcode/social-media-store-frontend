'use client'

import BlogEditor from "@/components/blog-editor";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useCreateblog } from "@/hooks/use-blog";
// import { FormEvent, useState } from "react";
// import { toast } from "sonner";

export default function BlogsPage() {
  // The blog content is managed using the useState hook.
  // const [title, setTitle] = useState<string>("")
  // const [description, setDescritption] = useState<string>("")
  // const [blogContent, setBlogContent] = useState("");
  // const { data: createBlog, isPending } = useCreateblog()
  //
  // const handleCreateBlog = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //
  //   if (title || description === "") {
  //     toast.error("fall fields are required")
  //     return
  //   }
  //   await createBlog({
  //     title,
  //     description,
  //     blogContent
  //   })
  //
  // };
  return (
    <div className="container mx-auto max-w-[70rem]">
      <BlogEditor />
    </div>
  );
}

