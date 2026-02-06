"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { ImagePlus, Link2, Trash2 } from "lucide-react";

import { createBlogPost, deleteBlogPost, updateBlogPost, uploadBlogImage } from "@/app/(admin)/admin/blog/actions";

type BlogEditorProps = {
  mode: "create" | "edit";
  postId?: string;
  initial: {
    title: string;
    excerpt: string;
    content: any;
    coverImagePath: string | null;
    published: boolean;
  };
};

export function BlogEditor({ mode, postId, initial }: BlogEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [published, setPublished] = useState(initial.published);
  const [coverImagePath, setCoverImagePath] = useState<string | null>(initial.coverImagePath);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: "Napište obsah článku…" })
    ],
    content: initial.content ?? null,
    editorProps: {
      attributes: { class: "ProseMirror" }
    }
  });

  useEffect(() => {
    // clean up
    return () => editor?.destroy();
  }, [editor]);

  const coverUrl = useMemo(() => {
    if (!coverImagePath) return null;
    // public blog bucket url
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const cleanBase = base.replace(/\/$/, "");
    const encoded = coverImagePath.split("/").map(encodeURIComponent).join("/");
    return `${cleanBase}/storage/v1/object/public/blog/${encoded}`;
  }, [coverImagePath]);

  const onInsertLink = () => {
    if (!editor) return;
    const url = window.prompt("URL odkazu:");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const onUploadInlineImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadBlogImage(fd);
    if (!editor) return;
    editor.chain().focus().setImage({ src: res.publicUrl }).run();
  };

  const onUploadCover = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadBlogImage(fd);
    setCoverImagePath(res.path);
  };

  const onSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const content = editor ? editor.getJSON() : null;
        if (mode === "create") {
          const res = await createBlogPost({
            title,
            excerpt,
            content,
            coverImagePath,
            published
          });
          router.push(`/admin/blog/${res.id}`);
          return;
        }
        if (!postId) throw new Error("Missing postId");
        await updateBlogPost({
          id: postId,
          title,
          excerpt,
          content,
          coverImagePath,
          published
        });
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepodařilo se uložit článek.");
      }
    });
  };

  const onDelete = () => {
    if (!postId) return;
    if (!confirm("Opravdu smazat článek?")) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteBlogPost({ id: postId });
        router.push("/admin/blog");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepodařilo se smazat článek.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="content-card space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="input-label">Titulek</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
          </div>
          <div className="flex items-center gap-3 md:justify-end">
            <label className="inline-flex items-center gap-2 text-sm text-offwhite/90">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-obsidian/60 text-champagne focus:ring-champagne"
              />
              Publikováno
            </label>
            <button type="button" className="btn-primary" disabled={pending} onClick={onSave}>
              {pending ? "Ukládám…" : "Uložit"}
            </button>
            {mode === "edit" && (
              <button type="button" className="btn-secondary" disabled={pending} onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="input-label">Perex</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="input-field"
            placeholder="Krátký popis pro SEO a výpis článků…"
          />
        </div>

        <div>
          <label className="input-label">Cover obrázek (volitelné)</label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                startTransition(async () => {
                  try {
                    await onUploadCover(file);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Upload coveru selhal.");
                  } finally {
                    if (coverInputRef.current) coverInputRef.current.value = "";
                  }
                });
              }}
            />
            <button type="button" className="btn-secondary" onClick={() => coverInputRef.current?.click()}>
              <ImagePlus className="h-4 w-4" />
              Nahrát cover
            </button>
            {coverImagePath && (
              <button type="button" className="btn-secondary" onClick={() => setCoverImagePath(null)}>
                Odebrat cover
              </button>
            )}
          </div>
          {coverUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
              <img src={coverUrl} alt="Cover" className="h-48 w-full object-cover" loading="lazy" />
            </div>
          )}
        </div>
      </div>

      <div className="content-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            Bold
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            Italic
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            • List
          </button>
          <button
            type="button"
            className="btn-secondary inline-flex items-center gap-2"
            onClick={onInsertLink}
          >
            <Link2 className="h-4 w-4" />
            Odkaz
          </button>

          <input
            ref={inlineImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              startTransition(async () => {
                try {
                  await onUploadInlineImage(file);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Upload obrázku selhal.");
                } finally {
                  if (inlineImageInputRef.current) inlineImageInputRef.current.value = "";
                }
              });
            }}
          />
          <button
            type="button"
            className="btn-secondary inline-flex items-center gap-2"
            onClick={() => inlineImageInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
            Obrázek
          </button>
        </div>

        <div className="rich-editor mt-4">{editor ? <EditorContent editor={editor} /> : null}</div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      )}
      {saved && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Uloženo.
        </div>
      )}
    </div>
  );
}

