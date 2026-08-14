// import React, { useRef, useState } from "react";
// import {
//   Bold,
//   Italic,
//   Underline as UnderlineIcon,
//   Highlighter,
//   Heading1,
//   Heading2,
//   Quote,
//   List,
//   ListOrdered,
//   Link2,
//   Image as ImageIcon,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
//   Palette,
// } from "lucide-react";

// export const HIGHLIGHT_COLORS = [
//   { name: "Gold", value: "#EAD9AE" },
//   { name: "Blush", value: "#E7C6C2" },
//   { name: "Sage", value: "#C9D3BE" },
//   { name: "Sky", value: "#C7D9E0" },
//   { name: "Lilac", value: "#D9CDE3" },
//   { name: "Peach", value: "#F0C9A0" },
//   { name: "Rose", value: "#E3A9A9" },
//   { name: "Mint", value: "#B7D9C6" },
//   { name: "Butter", value: "#F3E29B" },
//   { name: "Clay", value: "#D9B08C" },
// ];

// export default function Toolbar({ editor, onRequestImage }) {
//   const [colorOpen, setColorOpen] = useState(false);
//   const [linkOpen, setLinkOpen] = useState(false);
//   const [linkValue, setLinkValue] = useState("");
//   const savedRange = useRef(null);

//   if (!editor) return null;

//   function openLink() {
//     savedRange.current = { from: editor.state.selection.from, to: editor.state.selection.to };
//     setLinkValue(editor.getAttributes("link").href || "");
//     setLinkOpen(true);
//     setColorOpen(false);
//   }

//   function applyLink() {
//     let href = linkValue.trim();
//     const chain = editor.chain().focus();
//     if (savedRange.current) {
//       chain.setTextSelection(savedRange.current);
//     }
//     if (!href) {
//       chain.unsetLink().run();
//     } else {
//       if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) href = "https://" + href;
//       if (editor.state.selection.empty) {
//         chain.insertContent(`<a href="${href}">${href}</a>`).run();
//       } else {
//         chain.setLink({ href }).run();
//       }
//     }
//     setLinkOpen(false);
//   }

//   const Btn = ({ active, onClick, title, children }) => (
//     <button type="button" className={active ? "active" : ""} onMouseDown={(e) => e.preventDefault()} onClick={onClick} title={title}>
//       {children}
//     </button>
//   );

//   return (
//     <div className="vr-toolbar">
//       <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
//         <Bold size={15} />
//       </Btn>
//       <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
//         <Italic size={15} />
//       </Btn>
//       <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
//         <UnderlineIcon size={15} />
//       </Btn>

//       <span className="vr-tb-divider" />

//       <div className="vr-popover-wrap">
//         <Btn active={editor.isActive("highlight") || colorOpen} onClick={() => { setColorOpen((v) => !v); setLinkOpen(false); }} title="Highlight">
//           <Highlighter size={15} />
//         </Btn>
//         {colorOpen && (
//           <div className="vr-color-popover">
//             {HIGHLIGHT_COLORS.map((c) => (
//               <button
//                 key={c.value}
//                 type="button"
//                 className="vr-color-swatch"
//                 style={{ background: c.value }}
//                 title={c.name}
//                 onClick={() => {
//                   editor.chain().focus().toggleHighlight({ color: c.value }).run();
//                   setColorOpen(false);
//                 }}
//               />
//             ))}
//             <button
//               type="button"
//               className="vr-color-clear"
//               title="Remove highlight"
//               onClick={() => {
//                 editor.chain().focus().unsetHighlight().run();
//                 setColorOpen(false);
//               }}
//             >
//               <Palette size={20} />
//             </button>
//           </div>
//         )}
//       </div>

//       <span className="vr-tb-divider" />

//       <Btn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading">
//         <Heading1 size={15} />
//       </Btn>
//       <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Subheading">
//         <Heading2 size={15} />
//       </Btn>
//       <Btn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
//         <Quote size={15} />
//       </Btn>

//       <span className="vr-tb-divider" />

//       <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bulleted list">
//         <List size={15} />
//       </Btn>
//       <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
//         <ListOrdered size={15} />
//       </Btn>

//       <span className="vr-tb-divider" />

//       <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left">
//         <AlignLeft size={15} />
//       </Btn>
//       <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align center">
//         <AlignCenter size={15} />
//       </Btn>
//       <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right">
//         <AlignRight size={15} />
//       </Btn>
//       <Btn active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify">
//         <AlignJustify size={15} />
//       </Btn>

//       <span className="vr-tb-divider" />

//       <div className="vr-popover-wrap">
//         <Btn active={editor.isActive("link") || linkOpen} onClick={openLink} title="Insert link">
//           <Link2 size={15} />
//         </Btn>
//         {linkOpen && (
//           <div className="vr-link-popover">
//             <input
//               autoFocus
//               placeholder="paste a url…"
//               value={linkValue}
//               onChange={(e) => setLinkValue(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   applyLink();
//                 }
//                 if (e.key === "Escape") setLinkOpen(false);
//               }}
//             />
//             <button type="button" onClick={applyLink}>
//               Add
//             </button>
//           </div>
//         )}
//       </div>

//       <Btn onClick={onRequestImage} title="Insert image">
//         <ImageIcon size={15} />
//       </Btn>
//     </div>
//   );
// }


import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Highlighter,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Link2,
  Type,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
} from "lucide-react";

export const HIGHLIGHT_COLORS = [
  { name: "Gold", value: "#EAD9AE" },
  { name: "Blush", value: "#E7C6C2" },
  { name: "Sage", value: "#C9D3BE" },
  { name: "Sky", value: "#C7D9E0" },
  { name: "Lilac", value: "#D9CDE3" },
  { name: "Peach", value: "#F0C9A0" },
  { name: "Rose", value: "#E3A9A9" },
  { name: "Mint", value: "#B7D9C6" },
  { name: "Butter", value: "#F3E29B" },
  { name: "Clay", value: "#D9B08C" },
];

export default function Toolbar({ editor, onRequestImage }) {
  const [colorOpen, setColorOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [linkTextValue, setLinkTextValue] = useState("");
  const savedRange = useRef(null);

  if (!editor) return null;

  function openLink() {
    const { from, to } = editor.state.selection;
    savedRange.current = { from, to };
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    setLinkTextValue(selectedText);
    setLinkValue(editor.getAttributes("link").href || "");
    setLinkOpen(true);
    setColorOpen(false);
  }

  function applyLink() {
    let href = linkValue.trim();
    const label = linkTextValue.trim();
    const range = savedRange.current || editor.state.selection;
    const chain = editor.chain().focus();

    if (!href) {
      chain.setTextSelection(range).unsetLink().run();
      setLinkOpen(false);
      return;
    }
    if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) href = "https://" + href;

    if (label) {
      // a display text was given (typed fresh, or edited from the selection) —
      // replace whatever's in range with that text, turned into a link
      chain
        .insertContentAt(range, {
          type: "text",
          text: label,
          marks: [{ type: "link", attrs: { href } }],
        })
        .run();
    } else if (range.from !== range.to) {
      // no text typed, but something was selected — link the selection as-is
      chain.setTextSelection(range).setLink({ href }).run();
    } else {
      // nothing selected and no text typed — fall back to inserting the url itself
      chain
        .insertContentAt(range, {
          type: "text",
          text: href,
          marks: [{ type: "link", attrs: { href } }],
        })
        .run();
    }
    setLinkOpen(false);
  }

  function onFieldKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      applyLink();
    }
    if (e.key === "Escape") setLinkOpen(false);
  }

  const Btn = ({ active, onClick, title, children }) => (
    <button type="button" className={active ? "active" : ""} onMouseDown={(e) => e.preventDefault()} onClick={onClick} title={title}>
      {children}
    </button>
  );

  return (
    <div className="vr-toolbar">
      <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
        <Bold size={15} />
      </Btn>
      <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
        <Italic size={15} />
      </Btn>
      <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
        <UnderlineIcon size={15} />
      </Btn>

      <span className="vr-tb-divider" />

      <div className="vr-popover-wrap">
        <Btn active={editor.isActive("highlight") || colorOpen} onClick={() => { setColorOpen((v) => !v); setLinkOpen(false); }} title="Highlight">
          <Highlighter size={15} />
        </Btn>
        {colorOpen && (
          <div className="vr-color-popover">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className="vr-color-swatch"
                style={{ background: c.value }}
                title={c.name}
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color: c.value }).run();
                  setColorOpen(false);
                }}
              />
            ))}
            <button
              type="button"
              className="vr-color-clear"
              title="Remove highlight"
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setColorOpen(false);
              }}
            >
              <Palette size={13} />
            </button>
          </div>
        )}
      </div>

      <span className="vr-tb-divider" />

      <Btn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading">
        <Heading1 size={15} />
      </Btn>
      <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Subheading">
        <Heading2 size={15} />
      </Btn>
      <Btn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
        <Quote size={15} />
      </Btn>

      <span className="vr-tb-divider" />

      <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bulleted list">
        <List size={15} />
      </Btn>
      <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
        <ListOrdered size={15} />
      </Btn>

      <span className="vr-tb-divider" />

      <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left">
        <AlignLeft size={15} />
      </Btn>
      <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align center">
        <AlignCenter size={15} />
      </Btn>
      <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right">
        <AlignRight size={15} />
      </Btn>
      <Btn active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify">
        <AlignJustify size={15} />
      </Btn>

      <span className="vr-tb-divider" />

      <div className="vr-popover-wrap">
        <Btn active={editor.isActive("link") || linkOpen} onClick={openLink} title="Insert link">
          <Link2 size={15} />
        </Btn>
        {linkOpen && (
          <div className="vr-link-popover">
            <div className="vr-link-field">
              <Type size={14} />
              <input
                autoFocus
                placeholder="Text (optional)"
                value={linkTextValue}
                onChange={(e) => setLinkTextValue(e.target.value)}
                onKeyDown={onFieldKeyDown}
              />
            </div>
            <div className="vr-link-field">
              <Link2 size={14} />
              <input
                placeholder="Paste or type a link"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                onKeyDown={onFieldKeyDown}
              />
            </div>
            <button type="button" className="vr-link-apply" onClick={applyLink}>
              Apply
            </button>
          </div>
        )}
      </div>

      <Btn onClick={onRequestImage} title="Insert image">
        <ImageIcon size={15} />
      </Btn>
    </div>
  );
}