import React, { useRef, useState } from "react";
import { Paperclip, FileText, X } from "lucide-react";
import { api } from "../api.js";

function fileSizeLabel(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_ATTACH = 8;

export default function Attachments({ entryId, attachments, onAdd, onRemove, onError }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(fileList) {
    const room = MAX_ATTACH - attachments.length;
    if (room <= 0) {
      onError(`Only ${MAX_ATTACH} attachments fit on a single page.`);
      return;
    }
    const files = Array.from(fileList).slice(0, room);
    setBusy(true);
    for (const file of files) {
      try {
        const uploaded = await api.uploadAttachment(entryId, file);
        onAdd(uploaded);
      } catch (err) {
        onError(err.message || `"${file.name}" could not be attached.`);
      }
    }
    setBusy(false);
  }

  return (
    <div className="vr-attach-section">
      <div className="vr-label" style={{ fontSize: 11, opacity: 0.55 }}>
        Attachments — PDFs &amp; files
      </div>
      <div className="vr-attach-strip">
        {attachments.map((a) => (
          <a
            key={a.id}
            className="vr-attach-chip"
            href={api.resolveUrl(a.url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText size={15} />
            <span className="vr-attach-name">{a.name}</span>
            <span className="vr-attach-size">{fileSizeLabel(a.size)}</span>
            <button
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                onRemove(a.id);
              }}
              aria-label="Remove attachment"
            >
              <X size={13} />
            </button>
          </a>
        ))}
        {attachments.length < MAX_ATTACH && (
          <button className="vr-attach-add" disabled={busy} onClick={() => inputRef.current?.click()}>
            <Paperclip size={14} /> {busy ? "attaching…" : "Attach file"}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
