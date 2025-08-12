"use client"
import { Toggle } from '@/components/ui/toggle';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Type,
} from 'lucide-react';
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  // Font family options
  const fontFamilies = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Monospace', value: 'Consolas, Monaco, monospace' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { name: 'System UI', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  ]
  // Font size options
  const fontSizes = [
    { label: '8px', value: '8px' },
    { label: '10px', value: '10px' },
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '24px', value: '24px' },
    { label: '32px', value: '32px' },
  ];

  const options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive('heading', { level: 1 }),
      label: 'Heading 1',
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive('heading', { level: 2 }),
      label: 'Heading 2',
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive('heading', { level: 3 }),
      label: 'Heading 3',
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive('bold'),
      label: 'Bold',
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive('italic'),
      label: 'Italic',
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive('strike'),
      label: 'Strikethrough',
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      pressed: editor.isActive({ textAlign: 'left' }),
      label: 'Align Left',
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      pressed: editor.isActive({ textAlign: 'center' }),
      label: 'Align Center',
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      pressed: editor.isActive({ textAlign: 'right' }),
      label: 'Align Right',
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive('bulletList'),
      label: 'Bullet List',
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive('orderedList'),
      label: 'Ordered List',
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive('highlight'),
      label: 'Highlight',
    },
    {
      icon: <ImageIcon className="size-4" />,
      onClick: addImage,
      pressed: false,
      label: 'Add Image',
    },
  ];

  return (
    <div className="control-group flex justify-center">
      <div className="flex justify-center items-center gap-5 my-2 border w-fit rounded-lg shadow-sm">
        {/* Font Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Toggle
              className="cursor-pointer flex items-center gap-1"
              pressed={false}
              aria-label="Font Family"
            >
              <Type className="size-4" />
              <ChevronDown className="size-3" />
            </Toggle>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[180px]">
            {fontFamilies.map((font) => (
              <DropdownMenuItem
                key={font.value}
                onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
                className="flex items-center justify-between"
              >
                <span style={{ fontFamily: font.value }}>{font.name}</span>
                {editor.isActive('textStyle', { fontFamily: font.value }) && (
                  <span className="ml-2 text-xs text-green-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Toggle
              className="cursor-pointer flex items-center gap-1"
              pressed={false}
              aria-label="Font Size"
            >
              <span className="size-4 font-bold">Aa</span>
              <ChevronDown className="size-3" />
            </Toggle>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[120px]">
            {fontSizes.map((size) => (
              <DropdownMenuItem
                key={size.value}
                onClick={() => editor.chain().focus().setFontSize(size.value).run()}
                className="flex items-center justify-between"
              >
                <span style={{ fontSize: size.value }}>{size.label}</span>
                {editor.isActive('textStyle', { fontSize: size.value }) && (
                  <span className="ml-2 text-xs text-green-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Regular toggle buttons */}
        {options.map((item, index) => (
          <Toggle
            key={index}
            className="cursor-pointer"
            onClick={item.onClick}
            pressed={item.pressed}
            aria-label={item.label}
          >
            {item.icon}
          </Toggle>
        ))}
      </div>
    </div>
  );
}
