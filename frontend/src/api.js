const BASE_URL = import.meta.env.VITE_API_URL || "";

function authHeaders() {
  const token = localStorage.getItem("vr_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (username, password) =>
    fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),

  login: (username, password) =>
    fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),

  listEntries: () =>
    fetch(`${BASE_URL}/api/entries`, { headers: { ...authHeaders() } }).then(handle),

  createEntry: () =>
    fetch(`${BASE_URL}/api/entries`, { method: "POST", headers: { ...authHeaders() } }).then(handle),

  getEntry: (id) =>
    fetch(`${BASE_URL}/api/entries/${id}`, { headers: { ...authHeaders() } }).then(handle),

  updateEntry: (id, payload) =>
    fetch(`${BASE_URL}/api/entries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(handle),

  deleteEntry: (id) =>
    fetch(`${BASE_URL}/api/entries/${id}`, { method: "DELETE", headers: { ...authHeaders() } }).then(handle),

  uploadAttachment: (entryId, file) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${BASE_URL}/api/attachments/${entryId}`, {
      method: "POST",
      headers: { ...authHeaders() },
      body: form,
    }).then(handle);
  },

  deleteAttachment: (id) =>
    fetch(`${BASE_URL}/api/attachments/${id}`, { method: "DELETE", headers: { ...authHeaders() } }).then(handle),

  resolveUrl: (url) => `${BASE_URL}${url}`,
};
