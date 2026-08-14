// import { Node, mergeAttributes } from "@tiptap/core";
// import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
// import React, { useCallback, useRef } from "react";

// // A block-level image node that can be resized (drag the corner handle)
// // and aligned left / center / right. True freeform x/y placement isn't
// // offered here on purpose — that would break the flow of a written page,
// // the same way it's not offered in Notion or Google Docs either.
// function ResizableImageView({ node, updateAttributes, deleteNode, selected }) {
//   const { src, alt, width, align } = node.attrs;
//   const innerRef = useRef(null);

//   const onHandlePointerDown = useCallback(
//     (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       const startX = e.clientX;
//       const imgEl = innerRef.current?.querySelector("img");
//       const startWidth = imgEl ? imgEl.getBoundingClientRect().width : 300;

//       function onMove(ev) {
//         const delta = ev.clientX - startX;
//         const next = Math.round(Math.max(80, Math.min(1000, startWidth + delta)));
//         updateAttributes({ width: `${next}px` });
//       }
//       function onUp() {
//         window.removeEventListener("pointermove", onMove);
//         window.removeEventListener("pointerup", onUp);
//       }
//       window.addEventListener("pointermove", onMove);
//       window.addEventListener("pointerup", onUp);
//     },
//     [updateAttributes]
//   );

//   return (
//     <NodeViewWrapper className={`rimg-wrap align-${align || "center"}`}>
//       <div
//         ref={innerRef}
//         className={`rimg-inner${selected ? " is-selected" : ""}`}
//         style={{ width: width || "320px" }}
//       >
//         <img src={src} alt={alt || ""} draggable={false} />
//         <div className="rimg-toolbar" contentEditable={false}>
//           <button type="button" title="Align left" onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: "left" }); }}>L</button>
//           <button type="button" title="Align center" onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: "center" }); }}>C</button>
//           <button type="button" title="Align right" onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: "right" }); }}>R</button>
//           <span className="rimg-toolbar-sep" />
//           <button type="button" title="Remove image" onMouseDown={(e) => { e.preventDefault(); deleteNode(); }}>✕</button>
//         </div>
//         <span className="rimg-handle" onPointerDown={onHandlePointerDown} title="Drag to resize" />
//       </div>
//     </NodeViewWrapper>
//   );
// }

// export const ResizableImage = Node.create({
//   name: "resizableImage",
//   group: "block",
//   atom: true,
//   draggable: true,

//   addAttributes() {
//     return {
//       src: { default: null },
//       alt: { default: "" },
//       width: { default: "320px" },
//       align: { default: "center" },
//     };
//   },

//   parseHTML() {
//     return [
//       {
//         tag: "div.rimg-wrap",
//         getAttrs: (dom) => {
//           const img = dom.querySelector("img");
//           if (!img) return false;
//           return {
//             src: img.getAttribute("src"),
//             alt: img.getAttribute("alt") || "",
//             width: img.style.width || dom.getAttribute("data-width") || "320px",
//             align: dom.getAttribute("data-align") || "center",
//           };
//         },
//       },
//       {
//         tag: "img[src]",
//         getAttrs: (dom) => ({
//           src: dom.getAttribute("src"),
//           alt: dom.getAttribute("alt") || "",
//           width: dom.style.width || "320px",
//           align: "center",
//         }),
//       },
//     ];
//   },

//   renderHTML({ node }) {
//     const { src, alt, width, align } = node.attrs;
//     return [
//       "div",
//       { class: `rimg-wrap align-${align}`, "data-align": align, "data-width": width },
//       ["img", mergeAttributes({ src, alt, style: `width:${width}` })],
//     ];
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(ResizableImageView);
//   },

//   addCommands() {
//     return {
//       setResizableImage:
//         (attrs) =>
//         ({ commands }) =>
//           commands.insertContent({ type: this.name, attrs }),
//     };
//   },
// });

// export default ResizableImage;


import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import React, { useCallback, useRef } from "react";

// A block-level image node that can be resized from either edge and
// aligned left / center / right / full-width. Left and right alignment
// now float the image, so paragraph text actually wraps beside it,
// giving you an adjustable two-column feel. Center and full-width stay
// as standalone blocks, the same way they behave in Notion or Google Docs.

const MIN_WIDTH = 100;
const MAX_WIDTH = 900;

function clampWidth(px) {
  return Math.round(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, px)));
}

function ResizableImageView({ node, updateAttributes, deleteNode, selected }) {
  const { src, alt, width, align } = node.attrs;
  const innerRef = useRef(null);

  const startResize = useCallback(
    (edge) => (e) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const imgEl = innerRef.current?.querySelector("img");
      const startWidth = imgEl ? imgEl.getBoundingClientRect().width : 300;

      function onMove(ev) {
        const delta = ev.clientX - startX;
        // dragging the left handle further left should grow the image,
        // dragging the right handle further right should grow it
        const signedDelta = edge === "left" ? -delta : delta;
        updateAttributes({ width: `${clampWidth(startWidth + signedDelta)}px` });
      }
      function onUp() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [updateAttributes]
  );

  function setPreset(value) {
    updateAttributes({ width: value });
  }

  return (
    <NodeViewWrapper className={`rimg-wrap align-${align || "center"}`}>
      <div
        ref={innerRef}
        className={`rimg-inner${selected ? " is-selected" : ""}`}
        style={{ width: width || "320px" }}
      >
        <img src={src} alt={alt || ""} draggable={false} />

        <div className="rimg-toolbar" contentEditable={false}>
          <button type="button" title="Align left, wrap text" onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: "left" }); }}>L</button>
          <button type="button" title="Center, no wrap" onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: "center" }); }}>C</button>
          <button type="button" title="Align right, wrap text" onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: "right" }); }}>R</button>
          <span className="rimg-toolbar-sep" />
          <button type="button" title="Small (240px)" onMouseDown={(e) => { e.preventDefault(); setPreset("240px"); }}>S</button>
          <button type="button" title="Medium (380px)" onMouseDown={(e) => { e.preventDefault(); setPreset("380px"); }}>M</button>
          <button type="button" title="Full width" onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: "full", width: "100%" }); }}>F</button>
          <span className="rimg-toolbar-sep" />
          <button type="button" title="Remove image" onMouseDown={(e) => { e.preventDefault(); deleteNode(); }}>✕</button>
        </div>

        {align !== "full" && (
          <>
            <span className="rimg-handle rimg-handle-left" onPointerDown={startResize("left")} title="Drag to resize" />
            <span className="rimg-handle rimg-handle-right" onPointerDown={startResize("right")} title="Drag to resize" />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      width: { default: "320px" },
      align: { default: "center" }, // left | center | right | full
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.rimg-wrap",
        getAttrs: (dom) => {
          const img = dom.querySelector("img");
          if (!img) return false;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt") || "",
            width: img.style.width || dom.getAttribute("data-width") || "320px",
            align: dom.getAttribute("data-align") || "center",
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (dom) => ({
          src: dom.getAttribute("src"),
          alt: dom.getAttribute("alt") || "",
          width: dom.style.width || "320px",
          align: "center",
        }),
      },
    ];
  },

  renderHTML({ node }) {
    const { src, alt, width, align } = node.attrs;
    return [
      "div",
      { class: `rimg-wrap align-${align}`, "data-align": align, "data-width": width },
      ["img", mergeAttributes({ src, alt, style: `width:${width}` })],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },

  addCommands() {
    return {
      setResizableImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

export default ResizableImage;