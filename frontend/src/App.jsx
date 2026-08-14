import React, { useEffect, useRef, useState } from "react";
import { Menu, Lock, Feather, Sun, Cloud, CloudRain, Wind } from "lucide-react";
import Splash from "./components/Splash.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import Sidebar, { formatDate } from "./components/Sidebar.jsx";
import Editor from "./components/Editor.jsx";
import Attachments from "./components/Attachments.jsx";
import { api } from "./api.js";

const WEATHERS = [
  { id: "fair", label: "Fair", Icon: Sun },
  { id: "cloudy", label: "Cloudy", Icon: Cloud },
  { id: "stormy", label: "Stormy", Icon: CloudRain },
  { id: "windy", label: "Windy", Icon: Wind },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [entries, setEntries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loadingEntry, setLoadingEntry] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [splashVisible, setSplashVisible] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);

  const saveTimer = useRef(null);
  const currentEntryRef = useRef(null);
  useEffect(() => {
    currentEntryRef.current = currentEntry;
  }, [currentEntry]);

  // ---- boot: is there a saved session? ----
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("vr_token");
      const username = localStorage.getItem("vr_username");
      if (!token) {
        setCheckingAuth(false);
        return;
      }
      try {
        const list = await api.listEntries();
        setEntries(list);
        setUser({ username });
      } catch {
        localStorage.removeItem("vr_token");
        localStorage.removeItem("vr_username");
      }
      setCheckingAuth(false);
    })();
  }, []);

  // ---- splash: stay on screen at least ~1.1s, then fade once auth resolves ----
  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), 1100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!checkingAuth && minTimeDone) {
      setSplashFading(true);
      const t = setTimeout(() => setSplashVisible(false), 500);
      return () => clearTimeout(t);
    }
  }, [checkingAuth, minTimeDone]);

  async function loadEntries() {
    try {
      const list = await api.listEntries();
      setEntries(list);
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  function onAuthed(u) {
    setUser(u);
    loadEntries();
  }

  function signOut() {
    localStorage.removeItem("vr_token");
    localStorage.removeItem("vr_username");
    setUser(null);
    setEntries([]);
    setCurrentEntry(null);
    setSelectedId(null);
    setSidebarOpen(false);
  }

  async function selectEntry(id) {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      if (currentEntryRef.current) await persist(currentEntryRef.current);
    }
    setSidebarOpen(false);
    setSelectedId(id);
    setLoadingEntry(true);
    try {
      const full = await api.getEntry(id);
      setCurrentEntry(full);
    } catch (err) {
      setErrorMsg(err.message);
      setCurrentEntry(null);
    }
    setLoadingEntry(false);
  }

  async function createEntry() {
    try {
      const fresh = await api.createEntry();
      setEntries((prev) => [{ id: fresh.id, title: "Untitled entry", preview: "", date: fresh.date }, ...prev]);
      setCurrentEntry(fresh);
      setSelectedId(fresh.id);
      setSidebarOpen(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function deleteEntry(id) {
    try {
      await api.deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setCurrentEntry(null);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function persist(entry) {
    setSaveStatus("saving");
    try {
      const res = await api.updateEntry(entry.id, {
        title: entry.title,
        content: entry.content,
        weather: entry.weather,
      });
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, title: res.title, preview: res.preview } : e))
      );
      setSaveStatus("saved");
    } catch (err) {
      setSaveStatus("error");
      setErrorMsg(err.message || "This page could not be saved.");
    }
  }

  function scheduleSave(next) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(next), 700);
  }

  function updateField(field, value) {
    setCurrentEntry((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };
      scheduleSave(next);
      return next;
    });
  }

  function addAttachment(att) {
    setCurrentEntry((prev) => ({ ...prev, attachments: [...(prev.attachments || []), att] }));
  }

  async function removeAttachment(id) {
    try {
      await api.deleteAttachment(id);
      setCurrentEntry((prev) => ({ ...prev, attachments: prev.attachments.filter((a) => a.id !== id) }));
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  if (!user) {
    return (
      <>
        {splashVisible && <Splash fading={splashFading} />}
        <div className="vr-root">
          <div className="vr-noise" />
          <AuthScreen onAuthed={onAuthed} />
        </div>
      </>
    );
  }

  return (
    <>
      {splashVisible && <Splash fading={splashFading} />}
      <div className="vr-root">
        <div className="vr-noise" />
        <div className="vr-shell">
          <Sidebar
            entries={entries}
            selectedId={selectedId}
            onSelect={selectEntry}
            onCreate={createEntry}
            onDelete={deleteEntry}
            onSignOut={signOut}
            open={sidebarOpen}
            onCloseMobile={() => setSidebarOpen(false)}
            username={user.username}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="vr-topbar-mobile">
              <button className="vr-lock-btn" style={{ flex: "none" }} onClick={() => setSidebarOpen(true)}>
                <Menu size={15} /> Pages
              </button>
              <div className="vr-brand" style={{ fontSize: 16 }}>Écritoire</div>
              <button className="vr-lock-btn" style={{ flex: "none" }} onClick={signOut}>
                <Lock size={13} />
              </button>
            </div>

            <main className="vr-main">
              {!currentEntry && !loadingEntry && (
                <div className="vr-empty-main">
                  <Feather size={40} />
                  <p>Turn to a page on the left, or press the wax seal to begin a new one.</p>
                </div>
              )}

              {loadingEntry && (
                <div className="vr-empty-main">
                  <span className="vr-label">turning the page…</span>
                </div>
              )}

              {currentEntry && !loadingEntry && (
                <>
                  <div className="vr-entry-date-big vr-label">{formatDate(currentEntry.date)}</div>

                  <div className="vr-weather-row">
                    {WEATHERS.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        className={`vr-weather-chip ${currentEntry.weather === id ? "active" : ""}`}
                        onClick={() => updateField("weather", currentEntry.weather === id ? "" : id)}
                      >
                        <Icon size={13} /> {label}
                      </button>
                    ))}
                  </div>

                  <input
                    className="vr-title-input"
                    placeholder="Untitled entry"
                    value={currentEntry.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                  <div className="vr-divider" />

                  <Editor
                    key={currentEntry.id}
                    entryId={currentEntry.id}
                    initialHTML={currentEntry.content}
                    onChange={(html) => updateField("content", html)}
                    onError={setErrorMsg}
                  />

                  <Attachments
                    entryId={currentEntry.id}
                    attachments={currentEntry.attachments || []}
                    onAdd={addAttachment}
                    onRemove={removeAttachment}
                    onError={setErrorMsg}
                  />

                  <div className="vr-savestatus">
                    {saveStatus === "saving" && "saving to the ledger…"}
                    {saveStatus === "saved" && "safely written"}
                    {saveStatus === "error" && "could not save — try again"}
                  </div>
                </>
              )}
            </main>
          </div>
        </div>

        {errorMsg && (
          <div className="vr-toast" onClick={() => setErrorMsg("")}>
            {errorMsg}
          </div>
        )}
      </div>
    </>
  );
}
