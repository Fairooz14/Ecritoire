import React, { useState } from "react";
import { Lock, Unlock, Feather } from "lucide-react";
import { api } from "../api.js";

export default function AuthScreen({ onAuthed }) {
  const [tab, setTab] = useState("login"); // login | register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (tab === "register" && password !== confirmPw) {
      setError("The two passphrases don't match.");
      return;
    }
    setBusy(true);
    try {
      const fn = tab === "login" ? api.login : api.register;
      const data = await fn(username, password);
      localStorage.setItem("vr_token", data.token);
      localStorage.setItem("vr_username", data.user.username);
      onAuthed(data.user);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
    setBusy(false);
  }

  return (
    <div className="vr-lockwrap">
      <div className="vr-lockcard">
        <div className="vr-seal">{tab === "login" ? <Lock size={26} /> : <Unlock size={26} />}</div>
        <h1 className="vr-brand">Écritoire</h1>
        <p className="vr-tag">a private place for your days</p>

        <div className="vr-tabswitch">
          <button type="button" className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setError(""); }}>
            Sign in
          </button>
          <button type="button" className={tab === "register" ? "active" : ""} onClick={() => { setTab("register"); setError(""); }}>
            Create account
          </button>
        </div>

        {error && <div className="vr-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="vr-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="vr-field">
            <label htmlFor="password">Passphrase</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              required
            />
          </div>
          {tab === "register" && (
            <div className="vr-field">
              <label htmlFor="confirm">Confirm passphrase</label>
              <input
                id="confirm"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          )}
          <button type="submit" className="vr-btn-primary" disabled={busy}>
            <Feather size={15} /> {busy ? "one moment…" : tab === "login" ? "Unlock my diary" : "Bind a new diary"}
          </button>
        </form>

        <p className="vr-note">
          Your account and password live only on this server's own database. Nobody else's
          entries are ever visible to you, and yours are never visible to them.
        </p>
      </div>
    </div>
  );
}
