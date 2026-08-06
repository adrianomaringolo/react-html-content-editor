import {
  Fragment,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CodeEditorHandle, CodeEditorProps } from "./types";
import styles from "./textarea-code-editor.module.css";

/** Reads a positive numeric option, falling back when absent or malformed. */
const numberOption = (
  options: Record<string, unknown> | undefined,
  key: string,
  fallback: number,
): number => {
  const raw = options?.[key];
  return typeof raw === "number" && Number.isFinite(raw) && raw > 0
    ? raw
    : fallback;
};

/**
 * Inserts text at the current selection, preferring `execCommand` so the
 * browser's native undo stack keeps working. Falls back to a manual splice
 * (which loses undo history, and is the path taken in jsdom).
 */
const insertAtSelection = (
  textarea: HTMLTextAreaElement,
  text: string,
): void => {
  textarea.focus();

  try {
    if (document.execCommand("insertText", false, text)) return;
  } catch {
    // execCommand is unavailable (jsdom) or disallowed — fall through.
  }

  const { selectionStart, selectionEnd, value } = textarea;
  textarea.value =
    value.slice(0, selectionStart) + text + value.slice(selectionEnd);
  const caret = selectionStart + text.length;
  textarea.setSelectionRange(caret, caret);
};

/** Replaces the whole document, then restores the given selection. */
const replaceAll = (
  textarea: HTMLTextAreaElement,
  next: string,
  selectionStart: number,
  selectionEnd: number,
): void => {
  textarea.focus();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    if (!document.execCommand("insertText", false, next)) {
      textarea.value = next;
    }
  } catch {
    textarea.value = next;
  }

  textarea.setSelectionRange(selectionStart, selectionEnd);
};

/** Start offset of the line containing `index`. */
const lineStart = (value: string, index: number): number =>
  value.lastIndexOf("\n", index - 1) + 1;

/**
 * Above this many lines the gutter is dropped: it costs two DOM nodes per line,
 * which stops being worth it (and starts costing typing latency) on documents
 * this large. Reach for Monaco when editing files of that size.
 */
const MAX_GUTTER_LINES = 2000;

/**
 * Dependency-free code editor, used by default when no `codeEditor` is given.
 *
 * A plain `<textarea>` with a line-number gutter, indentation-aware
 * Tab / Shift+Tab / Enter handling and light/dark theming. There is no syntax
 * highlighting and no formatting — install `@monaco-editor/react` and pass
 * `MonacoCodeEditor` from `react-html-content-editor/monaco` for that.
 *
 * The gutter stays aligned with soft-wrapped lines without any measurement in
 * JS: each logical line contributes one grid row whose height is set by a
 * hidden copy of that line ("ghost") sharing the textarea's column, font and
 * wrapping rules. The textarea spans every row, so the scroll container — not
 * the textarea — is what scrolls.
 */
export function TextareaCodeEditor({
  defaultValue,
  language,
  theme,
  options,
  onChange,
  onReady,
  className = "",
  ariaLabel,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState(defaultValue);

  // Let keystrokes paint before the gutter re-renders on long documents.
  const deferredText = useDeferredValue(text);
  const lines = useMemo(() => deferredText.split("\n"), [deferredText]);

  const fontSize = numberOption(options, "fontSize", 14);
  const tabSize = numberOption(options, "tabSize", 2);
  const indent = useMemo(() => " ".repeat(tabSize), [tabSize]);
  const showLineNumbers =
    options?.lineNumbers !== "off" && lines.length <= MAX_GUTTER_LINES;
  const wordWrap = options?.wordWrap !== "off";
  const readOnly = options?.readOnly === true;
  const isDark = theme !== "vs-light" && theme !== "light";

  // Keep callbacks in refs so the imperative handle is created only once.
  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onChangeRef.current = onChange;
    onReadyRef.current = onReady;
  }, [onChange, onReady]);

  useEffect(() => {
    const scroller = scrollRef.current;
    const scrollListeners = new Set<() => void>();

    const handle: CodeEditorHandle = {
      focus: () => textareaRef.current?.focus(),
      // A plain textarea has no formatter; report that so toolbars can hide
      // the Format action.
      format: () => false,
      getScrollTop: () => scrollRef.current?.scrollTop ?? 0,
      getMaxScroll: () => {
        const el = scrollRef.current;
        if (!el) return 0;
        return Math.max(0, el.scrollHeight - el.clientHeight);
      },
      setScrollTop: (top) => {
        if (scrollRef.current) scrollRef.current.scrollTop = top;
      },
      onScroll: (listener) => {
        scrollListeners.add(listener);
        return () => scrollListeners.delete(listener);
      },
    };

    const notify = () => scrollListeners.forEach((listener) => listener());
    scroller?.addEventListener("scroll", notify);
    onReadyRef.current?.(handle);

    return () => {
      scroller?.removeEventListener("scroll", notify);
      scrollListeners.clear();
      onReadyRef.current?.(null);
    };
  }, []);

  const emit = useCallback((textarea: HTMLTextAreaElement) => {
    setText(textarea.value);
    onChangeRef.current(textarea.value);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    const textarea = e.currentTarget;

    // Tab / Shift+Tab: indent instead of moving focus out of the editor.
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = textarea;
      const spansLines =
        selectionStart !== selectionEnd &&
        value.slice(selectionStart, selectionEnd).includes("\n");

      if (!spansLines && !e.shiftKey) {
        insertAtSelection(textarea, indent);
        emit(textarea);
        return;
      }

      // Indent / outdent every line the selection touches.
      const blockStart = lineStart(value, selectionStart);
      const lineEnd = value.indexOf("\n", selectionEnd);
      const blockEnd = lineEnd === -1 ? value.length : lineEnd;

      let firstLineDelta = 0;
      let totalDelta = 0;
      const shifted = value
        .slice(blockStart, blockEnd)
        .split("\n")
        .map((line, index) => {
          if (e.shiftKey) {
            const removed = Math.min(
              tabSize,
              line.length - line.trimStart().length,
            );
            if (index === 0) firstLineDelta = -removed;
            totalDelta -= removed;
            return line.slice(removed);
          }
          if (index === 0) firstLineDelta = indent.length;
          totalDelta += indent.length;
          return indent + line;
        });

      const next =
        value.slice(0, blockStart) + shifted.join("\n") + value.slice(blockEnd);
      if (next === value) return;

      replaceAll(
        textarea,
        next,
        Math.max(blockStart, selectionStart + firstLineDelta),
        selectionEnd + totalDelta,
      );
      emit(textarea);
      return;
    }

    // Enter: carry the current line's indentation over to the new line.
    if (e.key === "Enter" && !e.shiftKey) {
      const { selectionStart, value } = textarea;
      const leading =
        value
          .slice(lineStart(value, selectionStart), selectionStart)
          .match(/^[ \t]*/)?.[0] ?? "";
      if (!leading) return;

      e.preventDefault();
      insertAtSelection(textarea, `\n${leading}`);
      emit(textarea);
    }
  };

  return (
    <div
      className={`${styles.editor} ${className}`.trim()}
      data-theme={isDark ? "dark" : "light"}
      data-line-numbers={showLineNumbers ? "on" : "off"}
      data-word-wrap={wordWrap ? "on" : "off"}
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className={styles.scroll} ref={scrollRef}>
        <div className={styles.grid} style={{ tabSize }}>
          {/*
            Rows are assigned explicitly. The textarea spans every row of
            column 2, so auto-placement would push each ghost past it into
            a row of its own and shear the gutter off by a line.
          */}
          {showLineNumbers ? (
            lines.map((line, index) => (
              <Fragment key={index}>
                <div
                  className={styles.lineNumber}
                  style={{ gridRow: index + 1 }}
                  aria-hidden='true'
                >
                  {index + 1}
                </div>
                {/* Sizes the row by wrapping just like the textarea. */}
                <div
                  className={styles.ghost}
                  style={{ gridRow: index + 1 }}
                  aria-hidden='true'
                >
                  {line === "" ? " " : line}
                </div>
              </Fragment>
            ))
          ) : (
            /* Without a gutter one ghost for the whole document is enough to
               size the scroll area, and keeps the DOM flat. */
            <div
              className={styles.ghost}
              style={{ gridRow: 1 }}
              aria-hidden='true'
            >
              {`${deferredText}\u00a0`}
            </div>
          )}

          <textarea
            ref={textareaRef}
            className={styles.textarea}
            style={{
              gridRow: showLineNumbers ? `1 / ${lines.length + 1}` : "1 / 2",
            }}
            defaultValue={defaultValue}
            onChange={(e) => emit(e.currentTarget)}
            onKeyDown={handleKeyDown}
            /* One row keeps the intrinsic height from inflating the first
               grid row; the grid stretches it to the content height. */
            rows={1}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize='off'
            autoCorrect='off'
            autoComplete='off'
            wrap={wordWrap ? "soft" : "off"}
            aria-label={ariaLabel ?? `${language.toUpperCase()} code`}
          />
        </div>
      </div>
    </div>
  );
}

// A plain textarea cannot reformat documents; toolbars hide the action.
TextareaCodeEditor.canFormat = false;
