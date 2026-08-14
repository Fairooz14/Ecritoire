import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import db from "../db.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

function publicUser(u) {
  return { id: u.id, username: u.username };
}

router.post("/register", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || typeof username !== "string" || username.trim().length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters." });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  const cleanUsername = username.trim().toLowerCase();

  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(cleanUsername);
  if (existing) {
    return res.status(409).json({ error: "That username is already taken." });
  }

  const id = uuid();
  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)"
  ).run(id, cleanUsername, passwordHash, now);

  const user = { id, username: cleanUsername };
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  const cleanUsername = String(username).trim().toLowerCase();
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(cleanUsername);
  if (!user) {
    return res.status(401).json({ error: "That username and passphrase don't match our records." });
  }
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: "That username and passphrase don't match our records." });
  }
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

export default router;
