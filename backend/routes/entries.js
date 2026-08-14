import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function toPreview(html) {
  const text = String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 120);
}

function attachmentsFor(entryId, userId) {
  return db
    .prepare(
      "SELECT id, original_name, mime_type, size, access_token FROM attachments WHERE entry_id = ? AND user_id = ? ORDER BY created_at ASC"
    )
    .all(entryId, userId)
    .map((a) => ({
      id: a.id,
      name: a.original_name,
      type: a.mime_type,
      size: a.size,
      url: `/api/attachments/${a.id}/file?token=${a.access_token}`,
    }));
}

// List entries (summary only)
router.get("/", (req, res) => {
  const rows = db
    .prepare(
      "SELECT id, title, preview, entry_date FROM entries WHERE user_id = ? ORDER BY entry_date DESC"
    )
    .all(req.userId);
  res.json(rows.map((r) => ({ id: r.id, title: r.title, preview: r.preview, date: r.entry_date })));
});

// Create entry
router.post("/", (req, res) => {
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO entries (id, user_id, title, content, preview, weather, entry_date, created_at, updated_at)
     VALUES (?, ?, '', '', '', '', ?, ?, ?)`
  ).run(id, req.userId, now, now, now);

  res.status(201).json({
    id,
    title: "",
    content: "",
    weather: "",
    date: now,
    attachments: [],
  });
});

// Get one entry (full content + attachments)
router.get("/:id", (req, res) => {
  const entry = db
    .prepare("SELECT * FROM entries WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!entry) return res.status(404).json({ error: "That page could not be found." });

  res.json({
    id: entry.id,
    title: entry.title,
    content: entry.content,
    weather: entry.weather,
    date: entry.entry_date,
    attachments: attachmentsFor(entry.id, req.userId),
  });
});

// Update entry
router.put("/:id", (req, res) => {
  const existing = db
    .prepare("SELECT id FROM entries WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: "That page could not be found." });

  const { title = "", content = "", weather = "" } = req.body || {};
  const preview = toPreview(content);
  const now = new Date().toISOString();

  db.prepare(
    "UPDATE entries SET title = ?, content = ?, preview = ?, weather = ?, updated_at = ? WHERE id = ? AND user_id = ?"
  ).run(title, content, preview, weather, now, req.params.id, req.userId);

  res.json({ ok: true, preview, title: title.trim() || "Untitled entry" });
});

// Delete entry
router.delete("/:id", (req, res) => {
  const existing = db
    .prepare("SELECT id FROM entries WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: "That page could not be found." });

  db.prepare("DELETE FROM entries WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
  res.json({ ok: true });
});

export default router;
