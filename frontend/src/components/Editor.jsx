import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./Toolbar.jsx";
import { ResizableImage } from "../extensions/ResizableImage.jsx";
import { api } from "../api.js";

export default function Editor({ entryId, initialHTML, onChange, onError }) {
  const imageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // resizableImage node replaces the default image handling
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Dear diary…" }),
      ResizableImage,
    ],
    content: initialHTML || "",
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  });

  async function handleImageFile(fileList) {
    const file = fileList?.[0];
    if (!file || !editor) return;
    try {
      const uploaded = await api.uploadAttachment(entryId, file);
      editor
        .chain()
        .focus()
        .setResizableImage({ src: api.resolveUrl(uploaded.url), alt: uploaded.name })
        .run();
    } catch (err) {
      onError(err.message || "That image could not be pressed into the page.");
    }
  }

  return (
    <div className="vr-editor-wrap">
      <Toolbar editor={editor} onRequestImage={() => imageInputRef.current?.click()} />
      <div className="vr-editor-area">
        <EditorContent editor={editor} className="vr-content-area" />
      </div>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.length) handleImageFile(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
