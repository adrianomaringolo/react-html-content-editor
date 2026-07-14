import React from "react";
import { Download } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

/** A format offered by {@link WysiwygExport}. */
export interface WysiwygExportFormat {
  label: string;
  /** File extension without the dot (e.g. `"html"`). */
  extension: string;
  /** MIME type for the download. */
  mime: string;
  /** Produce the file contents from the editor's inner HTML. */
  render: (html: string) => string;
}

/** Convert a fragment of editor HTML to Markdown (common tags only). */
export function htmlToMarkdown(html: string): string {
  const root = document.createElement("div");
  root.innerHTML = html;

  const inline = (node: Node): string =>
    Array.from(node.childNodes).map(serialize).join("");

  const serialize = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.nodeValue ?? "").replace(/\s+/g, " ");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const children = inline(el);
    switch (tag) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return `\n${"#".repeat(Number(tag[1]))} ${children.trim()}\n\n`;
      case "strong":
      case "b":
        return `**${children}**`;
      case "em":
      case "i":
        return `*${children}*`;
      case "code":
        return `\`${children}\``;
      case "pre":
        return `\n\`\`\`\n${el.textContent ?? ""}\n\`\`\`\n\n`;
      case "a":
        return `[${children}](${el.getAttribute("href") ?? ""})`;
      case "img":
        return `![${el.getAttribute("alt") ?? ""}](${el.getAttribute("src") ?? ""})`;
      case "br":
        return "  \n";
      case "hr":
        return `\n---\n\n`;
      case "blockquote":
        return `${children
          .trim()
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n")}\n\n`;
      case "ul":
        return `${listItems(el, "- ")}\n`;
      case "ol":
        return `${listItems(el, null)}\n`;
      case "p":
      case "div":
        return `${children.trim()}\n\n`;
      default:
        return children;
    }
  };

  const listItems = (list: HTMLElement, bullet: string | null): string => {
    let i = 1;
    return Array.from(list.children)
      .filter((c) => c.tagName.toLowerCase() === "li")
      .map((li) => {
        const prefix = bullet ?? `${i++}. `;
        return `${prefix}${inline(li).trim()}`;
      })
      .join("\n");
  };

  return inline(root).replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

const DEFAULT_FORMATS: WysiwygExportFormat[] = [
  {
    label: "HTML",
    extension: "html",
    mime: "text/html",
    render: (html) =>
      `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n</head>\n<body>\n${html}\n</body>\n</html>\n`,
  },
  {
    label: "Markdown",
    extension: "md",
    mime: "text/markdown",
    render: htmlToMarkdown,
  },
  {
    label: "Plain text",
    extension: "txt",
    mime: "text/plain",
    render: (html) => {
      const el = document.createElement("div");
      el.innerHTML = html;
      return `${el.textContent ?? ""}\n`;
    },
  },
];

/** Trigger a client-side file download. */
function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Export the editor content as a downloadable file (HTML, Markdown, text). */
export interface WysiwygExportProps extends NamedControlProps {
  /** Base name for the downloaded file, without extension (default: `"document"`). */
  fileName?: string;
  /** Formats offered in the dropdown. */
  formats?: WysiwygExportFormat[];
}

export const WysiwygExport: React.FC<WysiwygExportProps> = ({
  className,
  title = "Export",
  fileName = "document",
  formats = DEFAULT_FORMATS,
}) => {
  const { editorRef } = useWysiwygContext();

  const run = (format: WysiwygExportFormat) => {
    const root = editorRef.current;
    if (!root) return;
    download(
      `${fileName}.${format.extension}`,
      format.render(root.innerHTML),
      format.mime,
    );
  };

  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<Download size={16} aria-hidden='true' />}
    >
      <div className={styles.menuList}>
        {formats.map((format) => (
          <button
            key={format.extension}
            type='button'
            role='menuitem'
            aria-label={`Export as ${format.label}`}
            className={styles.menuItem}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(format)}
          >
            {format.label}
          </button>
        ))}
      </div>
    </WysiwygDropdown>
  );
};
