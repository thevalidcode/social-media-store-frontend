"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Extension, Node, mergeAttributes } from "@tiptap/core";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import CustomSelect, { Option } from "@/components/ui/CustomSelect";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { WysiwygEditorProps } from "@/types";
import { useUploadImage } from "@/hooks/use-file";

const defaultEnable = {
  bold: true,
  italic: true,
  underline: true,
  headings: true,
  lists: true,
  align: true,
  image: true,
  link: true,
  highlight: true,
  color: true,
  fontFamily: true,
  fontSize: true,
  code: true,
  video: true,
};

const headingOptions: Option<string>[] = [
  { label: "Normal", value: "" },
  { label: "Heading 1", value: "1" },
  { label: "Heading 2", value: "2" },
  { label: "Heading 3", value: "3" },
  { label: "Heading 4", value: "4" },
];

const colorOptions: Option<string>[] = [
  { label: "Color", value: "" },
  { label: "Dark", value: "#111827" },
  { label: "Red", value: "#ef4444" },
  { label: "Green", value: "#10b981" },
  { label: "Blue", value: "#2563eb" },
];

function useBuiltExtensions(
  enable: Required<NonNullable<WysiwygEditorProps["enable"]>>
) {
  return useMemo(() => {
    const exts: Extension[] = [
      StarterKit,
      TextStyle as any,
      FontFamily.configure({ types: ["textStyle"] }),
    ];

    if (enable.align) {
      exts.push(
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }) as any
      );
    }

    if (enable.highlight)
      exts.push(Highlight.configure({ multicolor: true }) as any);
    if (enable.color)
      exts.push(Color.configure({ types: ["textStyle"] }) as any);

    if (enable.image) {
      exts.push(
        ImageExt.configure({
          inline: true,
          allowBase64: true,
        }) as any
      );
    }

    // iframe node for video/embed
    exts.push(
      Node.create({
        name: "iframe",
        group: "block",
        atom: true,
        selectable: true,
        addAttributes() {
          return { src: { default: null } };
        },
        parseHTML() {
          return [{ tag: "iframe" }];
        },
        renderHTML({ HTMLAttributes }) {
          return [
            "div",
            { class: "video-embed" },
            [
              "iframe",
              mergeAttributes(
                {
                  frameborder: "0",
                  allow:
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                  allowfullscreen: "true",
                },
                HTMLAttributes
              ),
            ],
          ];
        },
      }) as any
    );

    return exts;
  }, [enable]);
}

export default function WysiwygEditor({
  collection = "default",
  initialContent = "",
  storeId = 1,
  placeholder = "Write something beautiful...",
  className = "",
  showToolbar = true,
  enable = defaultEnable,
  onChange,
  onSave,
  autoFocus = false,
  editorRef,
}: WysiwygEditorProps) {
  const built = useBuiltExtensions({ ...defaultEnable, ...enable } as Required<
    NonNullable<WysiwygEditorProps["enable"]>
  >);
  const { mutateAsync: uploadImage } = useUploadImage();

  const [isClient, setIsClient] = useState(false);

  const editor = useEditor({
    extensions: built,
    content: initialContent || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "richtext-content richtext-editor prose prose-sm sm:prose md:prose-lg focus:outline-none min-h-[240px] p-4 rounded-md",
        "aria-label": `${collection} editor`,
        placeholder,
      },
    },
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML(), editor);
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    editorRef?.(editor ?? null);
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || "");
    }
  }, [initialContent, editor]);

  const execInsertImage = useCallback(
    (url: string) => {
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Image added");
      }
    },
    [editor]
  );

  const handlePickImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const response = await uploadImage({ file, collection });
        execInsertImage(response.url); // insert actual backend URL
      } catch (err) {
        toast.error("Failed to upload image");
      }
    };

    input.click();
  }, [uploadImage, execInsertImage]);

  const handleToggleMark = useCallback(
    (mark: "bold" | "italic" | "strike" | "code") => {
      if (!editor) return;
      switch (mark) {
        case "bold":
          editor.chain().focus().toggleBold().run();
          break;
        case "italic":
          editor.chain().focus().toggleItalic().run();
          break;
        case "strike":
          editor.chain().focus().toggleStrike().run();
          break;
        case "code":
          editor.chain().focus().toggleCode().run();
          break;
      }
    },
    [editor]
  );

  const headSelect = useCallback(
    (level: 1 | 2 | 3 | 4 | 5 | 6) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const setTextAlign = useCallback(
    (align: "left" | "center" | "right" | "justify") => {
      editor?.chain().focus().setTextAlign(align).run();
    },
    [editor]
  );

  const insertLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor?.getAttributes("link").href || "";
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertVideo = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("iframe").src || "";
    const url = window.prompt("YouTube URL or embed URL", previous);
    if (url === null) return;
    if (url === "") return;

    const ytMatch = url.match(
      /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
    );
    const id = ytMatch ? ytMatch[1] : null;
    const embed = id ? `https://www.youtube.com/embed/${id}` : url;

    editor.chain().focus().setNode("iframe", { src: embed }).run();
  }, [editor]);

  const handleSave = useCallback(async () => {
    if (!editor) return;
    const html = editor.getHTML();
    try {
      await onSave?.(html);
      toast.success("Content saved");
    } catch (err) {
      toast.error("Save failed");
    }
  }, [editor, onSave]);

  const Toolbar = () => {
    if (!editor) return null;

    const activeHeading =
      headingOptions.find((option) => {
        if (!option.value) return !editor.isActive("heading");
        return editor.isActive("heading", { level: Number(option.value) });
      }) ?? headingOptions[0];

    const activeColor =
      colorOptions.find(
        (option) => option.value && editor.isActive("textStyle", { color: option.value }),
      ) ?? colorOptions[0];

    return (
      <div className="flex flex-wrap gap-2 items-center bg-card p-2 rounded-md border border-border">
        {enable.bold && (
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("bold") ? "default" : "ghost"}
            onClick={() => handleToggleMark("bold")}
            aria-pressed={editor.isActive("bold")}
          >
            <strong>B</strong>
          </Button>
        )}

        {enable.italic && (
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("italic") ? "default" : "ghost"}
            onClick={() => handleToggleMark("italic")}
          >
            <em>I</em>
          </Button>
        )}

        {enable.code && (
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("code") ? "default" : "ghost"}
            onClick={() => handleToggleMark("code")}
          >
            {"</>"}
          </Button>
        )}

        {enable.headings && (
          <div className="w-36">
            <CustomSelect
              options={headingOptions}
              value={activeHeading}
              onChange={(selected) => {
                if (Array.isArray(selected)) return;
                const level = Number(selected.value) as 1 | 2 | 3 | 4 | 5 | 6;
                if (!level) {
                  editor.chain().focus().setParagraph().run();
                  return;
                }
                headSelect(level);
              }}
              placeholder="Normal"
            />
          </div>
        )}

        {enable.lists && (
          <>
            <Button
              type="button"
              size="sm"
              variant={editor.isActive("bulletList") ? "default" : "ghost"}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              • List
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor.isActive("orderedList") ? "default" : "ghost"}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              1. List
            </Button>
          </>
        )}

        {enable.align && (
          <>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign("left")}
            >
              L
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign("center")}
            >
              C
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign("right")}
            >
              R
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign("justify")}
            >
              J
            </Button>
          </>
        )}

        {enable.image && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handlePickImage}
          >
            Image
          </Button>
        )}

        {enable.link && (
          <Button type="button" size="sm" variant="ghost" onClick={insertLink}>
            Link
          </Button>
        )}
        {(enable as any).video && (
          <Button type="button" size="sm" variant="ghost" onClick={insertVideo}>
            YouTube
          </Button>
        )}

        {enable.highlight && (
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("highlight") ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            H
          </Button>
        )}

        {enable.color && (
          <div className="w-32">
            <CustomSelect
              options={colorOptions}
              value={activeColor}
              onChange={(selected) => {
                if (Array.isArray(selected) || !selected.value) {
                  editor.chain().focus().unsetColor().run();
                  return;
                }
                editor.chain().focus().setColor(selected.value).run();
              }}
              placeholder="Color"
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
          >
            Undo
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
          >
            Redo
          </Button>

          <Separator orientation="vertical" />

          <Button
            type="button"
            size="sm"
            onClick={() => onChange?.(editor.getHTML(), editor)}
          >
            Preview
          </Button>

          {onSave && (
            <Button type="button" size="sm" onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {showToolbar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
        >
          <Toolbar />
        </motion.div>
      )}

      <div className="mt-3 border border-border rounded-md overflow-hidden bg-card">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
