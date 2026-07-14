import React from "react";
import { Printer } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import { useWysiwygContext } from "./context";
import type { NamedControlProps } from "./types";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Print the editor content in a new window. */
export interface WysiwygPrintProps extends NamedControlProps {
  /** Title of the print document (default: `document.title`). */
  documentTitle?: string;
  /** Extra CSS injected into the print document's `<head>`. */
  css?: string;
}

/**
 * Open the editor content in a new window and trigger the browser's print
 * dialog. Pass {@link WysiwygPrintProps.css} to style the printed page (e.g.
 * the same CSS applied to the preview).
 */
export const WysiwygPrint: React.FC<WysiwygPrintProps> = ({
  className,
  title = "Print",
  documentTitle,
  css,
}) => {
  const { editorRef } = useWysiwygContext();

  const print = () => {
    const root = editorRef.current;
    if (!root) return;
    const win = window.open("", "_blank", "width=820,height=640");
    if (!win) return;
    const heading = escapeHtml(documentTitle ?? document.title ?? "Document");
    win.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>${heading}</title>` +
        `${css ? `<style>${css}</style>` : ""}</head><body>${root.innerHTML}</body></html>`,
    );
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <WysiwygControl
      command='print'
      title={title}
      className={className}
      isActive={() => false}
      onActivate={print}
    >
      <Printer size={16} aria-hidden='true' />
    </WysiwygControl>
  );
};
