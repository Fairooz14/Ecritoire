<p align="center">
  <img src="./logo.png" width="160" alt="Écritoire wax seal logo" />
</p>

<h1 align="center">Écritoire</h1>
<p align="center"><em>A private, self-hosted digital diary.</em></p>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-3E1F20?style=flat-square">
  <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D18-3E1F20?style=flat-square">
  <img alt="Frontend" src="https://img.shields.io/badge/frontend-React%20%2B%20Vite-AA9F95?style=flat-square">
  <img alt="Backend" src="https://img.shields.io/badge/backend-Express%20%2B%20SQLite-AA9F95?style=flat-square">
  <img alt="Editor" src="https://img.shields.io/badge/editor-TipTap-D2CDC3?style=flat-square">
</p>

<p align="center">
  <a href="https://fairooz14.github.io/Ecritoire/"><strong>Open Écritoire →</strong></a>
</p>

<br/>

A private digital diary. Each person who signs up gets their own account and
their own space to write in, with no one else able to see it.

## What the app does

Écritoire is a personal journal you write in through your browser, in the
same spirit as a paper diary but with the flexibility of Notion style
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

## Known limitations

- There is no "forgot password" flow, since no mail server is set up.
  Losing your passphrase currently means losing access to that account's
  entries.
- Deleting a photo from inside an entry does not delete its file from
  `backend/uploads/`, only explicit attachment removals do. This does not
  affect privacy, since orphaned files are not linked from anywhere, but it
  is worth knowing if disk space matters to you.
- The per-file upload limit is 8MB.

## License

Released under the [MIT License](./LICENSE). You're free to use, modify,
and share this code, just keep the original copyright notice attached.