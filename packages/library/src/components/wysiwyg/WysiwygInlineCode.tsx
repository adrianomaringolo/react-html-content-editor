import React from "react";
import { Code } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import { useWysiwygContext } from "./context";
import type { NamedControlProps } from "./types";

/**
 * Wrap the current selection in an inline `<code>` element (or unwrap it if the
 * selection is already inside one). `execCommand` has no inline-code command,
 * so this uses the Range API directly via the editor ref.
 */
export const WysiwygInlineCode: React.FC<NamedControlProps> = ({
  className,
  title = "Inline code",
}) => {
  const { editorRef, commit } = useWysiwygContext();

  const closestCode = (node: Node | null): HTMLElement | null => {
    const root = editorRef.current;
    let el: HTMLElement | null =
      node instanceof HTMLElement ? node : (node?.parentElement ?? null);
    while (el && el !== root) {
      if (el.tagName === "CODE") return el;
      el = el.parentElement;
    }
    return null;
  };

  const isInsideCode = () => {
    const root = editorRef.current;
    const sel = document.getSelection();
    if (!root || !sel || sel.rangeCount === 0) return false;
    return root.contains(sel.anchorNode) && !!closestCode(sel.anchorNode);
  };

  const toggle = () => {
    const root = editorRef.current;
    const sel = document.getSelection();
    if (!root || !sel || sel.rangeCount === 0) return;
    if (!root.contains(sel.anchorNode)) return;

    const existing = closestCode(sel.anchorNode);
    // Capture the range before focusing (focus can collapse the live selection).
    const range = sel.getRangeAt(0).cloneRange();
    root.focus();
    if (existing) {
      // Unwrap: hoist the <code> children up and drop the wrapper.
      const parent = existing.parentNode;
      if (parent) {
        while (existing.firstChild)
          parent.insertBefore(existing.firstChild, existing);
        parent.removeChild(existing);
      }
    } else {
      if (range.collapsed) return; // nothing selected → no-op
      const code = document.createElement("code");
      try {
        code.appendChild(range.extractContents());
        range.insertNode(code);
        sel.removeAllRanges();
        const next = document.createRange();
        next.selectNodeContents(code);
        sel.addRange(next);
      } catch {
        return;
      }
    }
    commit(root.innerHTML);
  };

  return (
    <WysiwygControl
      command='formatInlineCode'
      title={title}
      className={className}
      isActive={() => isInsideCode()}
      onActivate={toggle}
    >
      <Code size={16} aria-hidden='true' />
    </WysiwygControl>
  );
};
