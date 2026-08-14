import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { v4 as uuid } from "uuid";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const MAX_BYTES = 8 * 1024 * 1024; // 8MB per file

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).slice(0, 16);
    cb(null, `${uuid()}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: MAX_BYTES } });

const router = Router();

// Upload a file to a given entry (requires standard auth)
router.post("/:entryId", requireAuth, upload.single("file"), (req, res) => {
  const entry = db
    .prepare("SELECT id FROM entries WHERE id = ? AND user_id = ?")
    .get(req.params.entryId, req.userId);

  if (!entry) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(404).json({ error: "That page could not be found." });
  }
  if (!req.file) {
    return res.status(400).json({ error: "No file was received." });
  }

  const id = uuid();
  const accessToken = crypto.randomBytes(24).toString("hex");
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO attachments (id, entry_id, user_id, original_name, stored_name, mime_type, size, access_token, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    entry.id,
    req.userId,
    req.file.originalname,
    req.file.filename,
    req.file.mimetype,
    req.file.size,
    accessToken,
    now
  );

  res.status(201).json({
    id,
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
    url: `/api/attachments/${id}/file?token=${accessToken}`,
  });
});

// Stream a file back. Authenticated either by the normal login token
// (Authorization header / ?token=) OR by the attachment's own unguessable
// access token, since <img> tags can't send custom headers.
router.get("/:id/file", (req, res) => {
  const att = db.prepare("SELECT * FROM attachments WHERE id = ?").get(req.params.id);
  if (!att) return res.status(404).end();

  const suppliedToken = req.query.token;
  if (suppliedToken !== att.access_token) {
    return res.status(403).json({ error: "Not authorized to view this file." });
  }

  const filePath = path.join(uploadsDir, att.stored_name);
  if (!fs.existsSync(filePath)) return res.status(404).end();

  res.setHeader("Content-Type", att.mime_type);
  res.setHeader("Cache-Control", "private, max-age=31536000");
  fs.createReadStream(filePath).pipe(res);
});

// Delete an attachment (requires standard auth + ownership)
router.delete("/:id", requireAuth, (req, res) => {
  const att = db
    .prepare("SELECT * FROM attachments WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!att) return res.status(404).json({ error: "That file could not be found." });

  const filePath = path.join(uploadsDir, att.stored_name);
  fs.unlink(filePath, () => {});
  db.prepare("DELETE FROM attachments WHERE id = ?").run(att.id);
  res.json({ ok: true });
});

export default router;
