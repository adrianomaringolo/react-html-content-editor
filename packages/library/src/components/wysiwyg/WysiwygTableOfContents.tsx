import React from "react";
import { ListTree } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import { useWysiwygContext } from "./context";
import type { NamedControlProps } from "./types";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Turn a heading's text into a unique, URL-safe id. */
function slugify(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section";
  let slug = base;
  let i = 1;
  while (used.has(slug)) slug = `${base}-${i++}`;
  used.add(slug);
  return slug;
}

/**
 * Insert a table of contents built from the headings (`h1`–`h6`) currently in
 * the editor. Each heading is given an `id` (if it lacks one) and linked from
 * the list; entries are indented by heading level.
 *
 * The inserted list is a static snapshot — re-run the control after changing
 * headings to regenerate it.
 */
export const WysiwygTableOfContents: React.FC<NamedControlProps> = ({
  className,
  title = "Table of contents",
}) => {
  const { editorRef, exec } = useWysiwygContext();

  const insert = () => {
    const root = editorRef.current;
    if (!root) return;
    const headings = Array.from(
      root.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"),
    );
    if (headings.length === 0) return;

    const used = new Set<string>();
    root.querySelectorAll("[id]").forEach((el) => used.add(el.id));

    const entries = headings.map((h) => {
      const id = h.id || slugify(h.textContent ?? "", used);
      if (!h.id) h.setAttribute("id", id);
      return { id, level: Number(h.tagName[1]), text: h.textContent ?? "" };
    });
    const minLevel = Math.min(...entries.map((e) => e.level));

    const items = entries
      .map(
        (e) =>
          `<li style="margin-left: ${(e.level - minLevel) * 1.25}rem"><a href="#${e.id}">${escapeHtml(
            e.text,
          )}</a></li>`,
      )
      .join("");
    const html = `<nav data-wysiwyg-toc="true" aria-label="Table of contents"><p><strong>Contents</strong></p><ul>${items}</ul></nav><p><br></p>`;
    exec("insertHTML", html);
  };

  return (
    <WysiwygControl
      command='insertHTML'
      title={title}
      className={className}
      isActive={() => false}
      onActivate={insert}
    >
      <ListTree size={16} aria-hidden='true' />
    </WysiwygControl>
  );
};
