type CollectionName ="default"| "users" | "blogs" | "services"; // e.g. "blogs" | "users" | "pages"
import { Editor } from "@tiptap/react";

export interface WysiwygEditorProps {
  collection?: CollectionName;
  initialContent?: string; // HTML
  storeId?: number; // HTML
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
  enable?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean; // via mark as custom CSS (we'll use textStyle)
    headings?: boolean;
    lists?: boolean;
    align?: boolean;
    image?: boolean;
    link?: boolean;
    highlight?: boolean;
    color?: boolean;
    fontFamily?: boolean;
    fontSize?: boolean;
    code?: boolean;
  };
  onChange?: (html: string, editor?: Editor | null) => void;
  onSave?: (html: string) => Promise<void> | void;
  autoFocus?: boolean;
  // Expose editor instance if parent wants to control it
  editorRef?: (editor: Editor | null) => void;
}
