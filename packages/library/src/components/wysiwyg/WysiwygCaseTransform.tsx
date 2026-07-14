import React from "react";
import { CaseSensitive } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

/** A case-transform mode offered by {@link WysiwygCaseTransform}. */
export interface WysiwygCaseMode {
  label: string;
  value: "upper" | "lower" | "title" | "sentence";
}

const DEFAULT_MODES: WysiwygCaseMode[] = [
  { label: "UPPERCASE", value: "upper" },
  { label: "lowercase", value: "lower" },
  { label: "Capitalize Each Word", value: "title" },
  { label: "Sentence case", value: "sentence" },
];

/** Apply a case transform to a string. */
function transform(text: string, mode: WysiwygCaseMode["value"]): string {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .replace(/(^|\s)(\S)/g, (_m, sep, ch) => sep + ch.toUpperCase());
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)(\S)/g, (_m, sep, ch) => sep + ch.toUpperCase());
  }
}

/**
 * Rewrite the text within the selection, transforming only the selected
 * portion of each text node so inline formatting (bold, links, …) is kept.
 * Returns `true` if anything changed.
 */
function transformSelection(
  root: HTMLElement,
  fn: (s: string) => string,
): boolean {
  const sel = document.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const range = sel.getRangeAt(0);
  if (range.collapsed || !root.contains(range.commonAncestorContainer)) {
    return false;
  }

  const nodes: Text[] = [];
  const container = range.commonAncestorContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    nodes.push(container as Text);
  } else {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = walker.nextNode())) {
      if (range.intersectsNode(n)) nodes.push(n as Text);
    }
  }

  let changed = false;
  for (const node of nodes) {
    const text = node.data;
    const from = node === range.startContainer ? range.startOffset : 0;
    const to = node === range.endContainer ? range.endOffset : text.length;
    if (to <= from) continue;
    const next = text.slice(0, from) + fn(text.slice(from, to)) + text.slice(to);
    if (next !== text) {
      node.data = next;
      changed = true;
    }
  }
  return changed;
}

/** Change the letter case of the selected text (upper / lower / title / sentence). */
export interface WysiwygCaseTransformProps extends NamedControlProps {
  /** Modes shown in the dropdown. */
  modes?: WysiwygCaseMode[];
}

export const WysiwygCaseTransform: React.FC<WysiwygCaseTransformProps> = ({
  className,
  title = "Change case",
  modes = DEFAULT_MODES,
}) => {
  const { editorRef, commit } = useWysiwygContext();

  const apply = (mode: WysiwygCaseMode["value"]) => {
    const root = editorRef.current;
    if (!root) return;
    if (transformSelection(root, (s) => transform(s, mode))) {
      commit(root.innerHTML);
    }
  };

  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<CaseSensitive size={16} aria-hidden='true' />}
    >
      <div className={styles.menuList}>
        {modes.map((mode) => (
          <button
            key={mode.value}
            type='button'
            role='menuitem'
            aria-label={mode.label}
            className={styles.menuItem}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => apply(mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </WysiwygDropdown>
  );
};
