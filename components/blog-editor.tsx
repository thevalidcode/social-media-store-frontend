"use client";
import MenuBar from "@/app/admin/components/menuBar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle, FontFamily } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { useState, FormEvent, useCallback } from "react";
import { useCreateblog } from "@/hooks/use-blog";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

const BlogEditor = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescritption] = useState<string>("");
  const [blogContent, setBlogContent] = useState("");

  const { mutateAsync: createBlog, isPending } = useCreateblog();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: blogContent,
    onUpdate: ({ editor }) => {
      setBlogContent(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none border  px-3 min-h-[300px]",
      },
    },
  });

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  const handleCreateBlog = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("All fields are required");
      return;
    }
    await createBlog(
      {
        title,
        description,
        content: blogContent,
      },
      {
        onSuccess: () => {
          toast.success("blog created successfully");
        },
        onError: (error: Error) => {
          toast.error(error instanceof Error ? error.message : String(error));
        },
      }
    );
  };

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <form onSubmit={handleCreateBlog} className="my-5">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="blogTitle" className="text-muted">
              Title
            </Label>
            <Input
              id="blogTitle"
              className="rounded-sm"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="blogDescription">Description</Label>
            <Input
              id="blogDescription"
              className="rounded-sm"
              title="description"
              value={description}
              onChange={(e) => setDescritption(e.target.value)}
            />
          </div>
        </div>

        <EditorContent editor={editor} className="mt-2" />
        <div className="flex justify-end items-center py-2">
          <Button type="submit" size="lg" className="cursor-pointer">
            {isPending ? "creating blog" : "create blog"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
