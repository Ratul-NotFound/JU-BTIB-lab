"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[160px] p-4 focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[200px] border border-[var(--border)] rounded bg-[var(--surface)] animate-pulse" />
    );
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div
      className={cn(
        "rounded border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-[var(--border)] bg-[var(--surface-raised)] select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors",
            editor.isActive("bold") && "bg-[var(--surface)] text-[var(--bio-teal)] font-bold shadow-xs"
          )}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors",
            editor.isActive("italic") && "bg-[var(--surface)] text-[var(--bio-teal)] font-bold shadow-xs"
          )}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[var(--border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors",
            editor.isActive("heading", { level: 1 }) && "bg-[var(--surface)] text-[var(--bio-teal)] font-bold shadow-xs"
          )}
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors",
            editor.isActive("heading", { level: 2 }) && "bg-[var(--surface)] text-[var(--bio-teal)] font-bold shadow-xs"
          )}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors",
            editor.isActive("heading", { level: 3 }) && "bg-[var(--surface)] text-[var(--bio-teal)] font-bold shadow-xs"
          )}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[var(--border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors",
            editor.isActive("bulletList") && "bg-[var(--surface)] text-[var(--bio-teal)] font-bold shadow-xs"
          )}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors",
            editor.isActive("orderedList") && "bg-[var(--surface)] text-[var(--bio-teal)] font-bold shadow-xs"
          )}
          title="Ordered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors",
            editor.isActive("blockquote") && "bg-[var(--surface)] text-[var(--bio-teal)] font-bold shadow-xs"
          )}
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[var(--border)] mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={cn(
            "p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors",
            editor.isActive("link") && "bg-[var(--surface)] text-[var(--bio-teal)] font-bold shadow-xs"
          )}
          title="Insert Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] transition-colors text-[var(--text-secondary)]"
          title="Insert Image"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] disabled:opacity-30 transition-colors"
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded text-xs hover:bg-[var(--surface-muted)] disabled:opacity-30 transition-colors"
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
