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
import { Extension } from "@tiptap/core";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { WysiwygEditorProps } from "@/types";

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
};

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

  const [isClient, setIsClient] = useState(false);

  const editor = useEditor({
    extensions: built,
    content: initialContent || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose md:prose-lg focus:outline-none min-h-[240px] p-4 rounded-md",
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

  const execInsertImage = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        if (src && editor) {
          editor.chain().focus().setImage({ src }).run();
          toast.success("Image added");
        }
      };
      reader.readAsDataURL(file);
    },
    [editor]
  );

  const handlePickImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (f) execInsertImage(f);
    };
    input.click();
  }, [execInsertImage]);

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
    return (
      <div className="flex flex-wrap gap-2 items-center bg-card p-2 rounded-md border border-border">
        {enable.bold && (
          <Button
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
            size="sm"
            variant={editor.isActive("italic") ? "default" : "ghost"}
            onClick={() => handleToggleMark("italic")}
          >
            <em>I</em>
          </Button>
        )}

        {enable.code && (
          <Button
            size="sm"
            variant={editor.isActive("code") ? "default" : "ghost"}
            onClick={() => handleToggleMark("code")}
          >
            {"</>"}
          </Button>
        )}

        {enable.headings && (
          <Select
            value=""
            onValueChange={(v) => {
              const level = Number(v) as 1 | 2 | 3 | 4 | 5 | 6;
              headSelect(level || 1);
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Normal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Heading 1</SelectItem>
              <SelectItem value="2">Heading 2</SelectItem>
              <SelectItem value="3">Heading 3</SelectItem>
              <SelectItem value="4">Heading 4</SelectItem>
            </SelectContent>
          </Select>
        )}

        {enable.lists && (
          <>
            <Button
              size="sm"
              variant={editor.isActive("bulletList") ? "default" : "ghost"}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              • List
            </Button>
            <Button
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
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign("left")}
            >
              L
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign("center")}
            >
              C
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign("right")}
            >
              R
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTextAlign("justify")}
            >
              J
            </Button>
          </>
        )}

        {enable.image && (
          <Button size="sm" variant="ghost" onClick={handlePickImage}>
            Image
          </Button>
        )}

        {enable.link && (
          <Button size="sm" variant="ghost" onClick={insertLink}>
            Link
          </Button>
        )}

        {enable.highlight && (
          <Button
            size="sm"
            variant={editor.isActive("highlight") ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            H
          </Button>
        )}

        {enable.color && (
          <Select
            value=""
            onValueChange={(value) =>
              editor
                .chain()
                .focus()
                .setColor(value || "")
                .run()
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="#111827">Dark</SelectItem>
              <SelectItem value="#ef4444">Red</SelectItem>
              <SelectItem value="#10b981">Green</SelectItem>
              <SelectItem value="#2563eb">Blue</SelectItem>
            </SelectContent>
          </Select>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
          >
            Undo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
          >
            Redo
          </Button>

          <Separator orientation="vertical" />

          <Button
            size="sm"
            onClick={() => onChange?.(editor.getHTML(), editor)}
          >
            Preview
          </Button>

          {onSave && (
            <Button size="sm" onClick={handleSave}>
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
