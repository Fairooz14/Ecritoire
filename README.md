# Écritoire 

A private digital diary. Each person who signs up gets their own account and
their own space to write in, with no one else able to see it.

Color theme: Cobblestone `#AA9F95`, Creme `#D2CDC3`, Ruby `#3E1F20`, Brownie `#3E2B24`.

## What the app does

Écritoire  is a personal journal you write in through your browser, in
the same spirit as a paper diary but with the flexibility of Notion style
formatting.

- **Your own account.** You sign up with a username and passphrase. Every
  entry you write belongs only to your account, and no other user can ever
  read, list, or open it.
- **A page for each entry.** Every entry shows its date automatically, and
  you can tag it with a weather stamp (Fair, Cloudy, Stormy, Windy), a small
  nod to how old paper diaries used to open.
- **Rich text writing.** Bold, italic, underline, 10 highlighter colors,
  headings, blockquotes, bulleted and numbered lists, clickable links, and
  left, right, center, and justified text alignment.
- **Photos in your writing.** Insert an image anywhere in an entry, resize
  it by dragging its corner, and align it left, center, or right within the
  page.
- **File attachments.** Attach PDFs or any other file type to an entry.
  They appear as a small chip you can open or remove.
- **Autosave.** Entries save quietly in the background as you write, with a
  small status note at the bottom of the page.

## How to use the app

**Signing up.** The first time you open the app, choose "Create account" on
the sign in screen, pick a username and a passphrase of at least six
characters, and submit. You are taken straight into your diary.

**Writing an entry.** Click the wax seal button at the bottom of the
sidebar to start a new page. Give it a title, optionally pick a weather
stamp, then write in the main text area. Formatting is done through the
toolbar above the writing area:

- Bold, italic, and underline buttons for basic emphasis
- The highlighter icon opens a set of colors to mark passages
- Heading and quote buttons for structure
- List buttons for bulleted or numbered lists
- The alignment buttons to set left, center, right, or justified text
- The link button to turn selected text, or a pasted address, into a
  clickable link
- The image button to insert a photo at the cursor. Once inserted, hover
  over the photo to resize it from the corner handle or align it with the
  small toolbar that appears above it

**Attaching files.** Below the writing area, use "Attach file" to add a PDF
or any other document to that entry. Click an attachment to open it, or the
small x to remove it.

**Browsing past entries.** All your entries are listed in the sidebar,
newest first, each showing its date, title, and a short preview. Click any
entry to open it. Hover over an entry to reveal a trash icon if you want to
delete it.

**Signing out.** Use "Close diary" at the bottom of the sidebar to sign out
of your account on that device.

## Running it yourself

### Prerequisites

- Node.js 18 or newer (check with `node -v`)
- npm (comes with Node)

### Setup

1. Open the `Écritoire ` folder in VS Code.
2. Install everything:
   ```bash
   npm run install:all
   ```
3. Create your environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```
   (On Windows Command Prompt, use `copy backend\.env.example backend\.env`
   instead.)

   Open `backend/.env` and replace `JWT_SECRET` with a random string, for
   example the output of:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Start both servers together:
   ```bash
   npm run dev
   ```
   The API runs on `http://localhost:4000` and the diary itself runs on
   `http://localhost:5173`. Open that second address in your browser.

   You can also run them separately in two terminals if you prefer:
   ```bash
   npm run dev --prefix backend
   npm run dev --prefix frontend
   ```

Your entries are stored in `backend/data/Écritoire.db`, and any uploaded
files are stored in `backend/uploads/`. Both are already excluded from git.

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Écritoire  diary"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Your `.env` file, `node_modules`, the database, and uploaded files are all
excluded from git already, so none of your private data or secrets get
committed.

## Using it after you host it

Pushing the code to GitHub is just the first step. To actually open your
diary from anywhere (your phone, another computer, a friend's laptop), the
app needs to be deployed and running somewhere with a public address, not
just sitting in a GitHub repository.

1. **Deploy the backend** to a Node host such as Render, Railway, or
   Fly.io, or to your own server. Set `JWT_SECRET` and `CORS_ORIGIN` as
   environment variables there, the same way you set them locally in
   `backend/.env`. This gives you a public API address, something like
   `https://your-app-name.onrender.com`.
2. **Deploy the frontend** to a static host such as Vercel, Netlify, or
   Cloudflare Pages. Before building, set `VITE_API_URL` in
   `frontend/.env` to the backend address from step 1, then build with
   `npm run build --prefix frontend`. Most of these hosts can also build
   directly from your GitHub repository each time you push.
3. Once both are live, you will have one public web address for the diary
   itself, for example `https://your-diary.vercel.app`. That is the link
   you open and bookmark.

From that point on, using the app is the same anywhere you open that link.
Sign in with your username and passphrase, and your entries are there,
whether you are on your laptop, your phone, or a different computer
entirely. Nothing needs to be running on your own machine for it to work,
since the backend is doing that job continuously on its host.

A couple of things to keep in mind once it is public:

- Use the `https://` address your host gives you, not a plain `http://`
  one, since your passphrase and login session should not travel
  unencrypted once you are outside your own computer.
- SQLite is a single file on disk. Confirm your backend host keeps that
  file on persistent storage, or your entries could be lost when the
  server restarts or redeploys.

## Known limitations

- There is no "forgot password" flow, since no mail server is set up.
  Losing your passphrase currently means losing access to that account's
  entries.
- Deleting a photo from inside an entry does not delete its file from
  `backend/uploads/`, only explicit attachment removals do. This does not
  affect privacy, since orphaned files are not linked from anywhere, but it
  is worth knowing if disk space matters to you.
- The per-file upload limit is 8MB.