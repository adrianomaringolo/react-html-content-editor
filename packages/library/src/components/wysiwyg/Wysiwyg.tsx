import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./wysiwyg.module.css";
import { WysiwygContext } from "./context";

/**
 * The rich-text editing commands are provided by the legacy `execCommand`
 * API. It is marked `@deprecated` in the DOM typings but remains the only
 * cross-browser way to run these commands; this typed alias documents the
 * intentional use and keeps type-checking without the deprecation noise.
 */
interface RichTextDocument {
  execCommand(commandId: string, showUI?: boolean, value?: string): boolean;
  queryCommandState(commandId: string): boolean;
  queryCommandValue(commandId: string): string;
}

const richTextDoc = (): RichTextDocument =>
  document as unknown as RichTextDocument;

/**
 * WYSIWYG editor root. Manages the editor value (controlled or uncontrolled)
 * and exposes formatting commands to the composed toolbar controls via
 * context.
 *
 * @example
 * ```tsx
 * <Wysiwyg defaultValue="<p>Hello</p>" onChange={setHtml}>
 *   <WysiwygToolbar>
 *     <WysiwygBold />
 *     <WysiwygItalic />
 *     <WysiwygFontSize />
 *   </WysiwygToolbar>
 *   <WysiwygContent placeholder="Start writing…" />
 * </Wysiwyg>
 * ```
 */
export interface WysiwygProps {
  /** Controlled HTML value. */
  value?: string;
  /** Initial HTML value when uncontrolled. */
  defaultValue?: string;
  /** Fired with the new HTML whenever the content changes. */
  onChange?: (html: string) => void;
  /** Render the editor read-only and disable every control. */
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Wysiwyg: React.FC<WysiwygProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  disabled = false,
  children,
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  // Starts empty so the initial value is always written into the DOM on mount;
  // thereafter it tracks the emitted HTML to avoid caret-resetting rewrites.
  const lastHtmlRef = useRef<string>("");

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [version, setVersion] = useState(0);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const commit = useCallback(
    (html: string) => {
      lastHtmlRef.current = html;
      if (!isControlled) {
        setUncontrolledValue(html);
      }
      onChange?.(html);
    },
    [isControlled, onChange],
  );

  const exec = useCallback(
    (command: string, commandValue?: string, useCss?: boolean) => {
      if (disabled) return;
      const el = editorRef.current;
      if (!el) return;

      el.focus();
      if (useCss !== undefined) {
        try {
          richTextDoc().execCommand("styleWithCSS", false, String(useCss));
        } catch {
          /* not all engines support styleWithCSS */
        }
      }
      try {
        richTextDoc().execCommand(command, false, commandValue);
      } catch {
        /* command unsupported in this environment */
      }
      commit(el.innerHTML);
      bump();
    },
    [disabled, commit, bump],
  );

  const isActive = useCallback((command: string) => {
    try {
      return richTextDoc().queryCommandState(command);
    } catch {
      return false;
    }
  }, []);

  const queryValue = useCallback((command: string) => {
    try {
      return richTextDoc().queryCommandValue(command);
    } catch {
      return "";
    }
  }, []);

  // Re-render controls when the selection moves inside the editor so their
  // active state stays in sync with the caret.
  useEffect(() => {
    const handleSelectionChange = () => {
      const el = editorRef.current;
      const selection = document.getSelection();
      if (!el || !selection || selection.rangeCount === 0) return;
      if (el.contains(selection.anchorNode)) {
        bump();
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [bump]);

  return (
    <WysiwygContext.Provider
      value={{
        editorRef,
        lastHtmlRef,
        value,
        commit,
        exec,
        isActive,
        queryValue,
        version,
        disabled,
      }}
    >
      <div
        className={`${styles.wysiwyg} ${className}`.trim()}
        data-disabled={disabled || undefined}
      >
        {children}
      </div>
    </WysiwygContext.Provider>
  );
};
