import React from "react";
import { Feather, Lock, Plus, Trash2, Menu } from "lucide-react";

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default function Sidebar({
  entries,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onSignOut,
  open,
  onCloseMobile,
  username,
}) {
  return (
    <>
      {open && <div className="vr-sidebar-scrim" onClick={onCloseMobile} />}
      <aside className={`vr-sidebar ${open ? "open" : ""}`}>
        <div className="vr-sidebar-head">
          <div className="vr-brand">
            <Feather size={18} /> Écritoire 
          </div>
          <p>
            {username ? `${username} · ` : ""}
            {entries.length} {entries.length === 1 ? "page" : "pages"} written
          </p>
        </div>
        <div className="vr-entrylist">
          {entries.length === 0 && (
            <div className="vr-empty-list">
              Your ledger is empty.
              <br />
              Press the seal below to begin your first page.
            </div>
          )}
          {entries.map((e) => (
            <div
              key={e.id}
              className={`vr-entry-item ${selectedId === e.id ? "active" : ""}`}
              onClick={() => onSelect(e.id)}
            >
              <div className="vr-entry-date vr-label">{formatDate(e.date)}</div>
              <div className="vr-entry-title">{e.title || "Untitled entry"}</div>
              <div className="vr-entry-preview">{e.preview || "…"}</div>
              <button
                className="vr-entry-del"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onDelete(e.id);
                }}
                aria-label="Delete entry"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="vr-sidebar-foot">
          <button className="vr-lock-btn" onClick={onSignOut}>
            <Lock size={13} /> Close diary
          </button>
          <button className="vr-seal-btn" onClick={onCreate} aria-label="New entry">
            <Plus size={20} />
          </button>
        </div>
      </aside>
    </>
  );
}

export { formatDate };
