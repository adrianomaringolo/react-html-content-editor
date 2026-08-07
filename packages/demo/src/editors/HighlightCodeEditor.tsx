import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  CodeEditorHandle,
  CodeEditorProps,
} from "react-html-content-editor";
import { isDarkTheme, numberOption } from "./options";
import { tokenize } from "./highlight";
import "./highlight-code-editor.css";

/**
 * A hand-rolled code editor with syntax highlighting and no dependencies.
 *
 * Shows that `codeEditor` is not limited to wrapping an existing library: a
 * transparent `<textarea>` sits on top of a coloured `<pre>` rendering the same
 * text, and the two stay aligned because they share every typographic property
 * that affects layout. The textarea is the scroller; the `<pre>` is dragged
 * along with it.
 */
export function HighlightCodeEditor({
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
  const preRef = useRef<HTMLPreElement | null>(null);
  const [text, setText] = useState(defaultValue);

  const fontSize = numberOption(options, "fontSize", 14);
  const tabSize = numberOption(options, "tabSize", 2);
  const readOnly = options?.readOnly === true;

  const tokens = useMemo(() => tokenize(text, language), [text, language]);

  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onChangeRef.current = onChange;
    onReadyRef.current = onReady;
  }, [onChange, onReady]);

  useEffect(() => {
    const scrollListeners = new Set<() => void>();

    const handle: CodeEditorHandle = {
      focus: () => textareaRef.current?.focus(),
      format: () => false,
      getScrollTop: () => textareaRef.current?.scrollTop ?? 0,
      getMaxScroll: () => {
        const el = textareaRef.current;
        if (!el) return 0;
        return Math.max(0, el.scrollHeight - el.clientHeight);
      },
      setScrollTop: (top) => {
        const el = textareaRef.current;
        if (!el) return;
        el.scrollTop = top;
        // Setting scrollTop in JS fires no scroll event in some engines, so
        // the highlight layer is realigned explicitly.
        if (preRef.current) preRef.current.scrollTop = el.scrollTop;
      },
      onScroll: (listener) => {
        scrollListeners.add(listener);
        return () => scrollListeners.delete(listener);
      },
    };

    const textarea = textareaRef.current;
    const notify = () => {
      if (preRef.current && textarea) {
        preRef.current.scrollTop = textarea.scrollTop;
        preRef.current.scrollLeft = textarea.scrollLeft;
      }
      scrollListeners.forEach((listener) => listener());
    };

    textarea?.addEventListener("scroll", notify);
    onReadyRef.current?.(handle);

    return () => {
      textarea?.removeEventListener("scroll", notify);
      scrollListeners.clear();
      onReadyRef.current?.(null);
    };
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.currentTarget.value);
      onChangeRef.current(event.currentTarget.value);
    },
    [],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab" || readOnly) return;
    event.preventDefault();

    const textarea = event.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;
    const indent = " ".repeat(tabSize);
    const next =
      value.slice(0, selectionStart) + indent + value.slice(selectionEnd);

    textarea.value = next;
    const caret = selectionStart + indent.length;
    textarea.setSelectionRange(caret, caret);
    setText(next);
    onChangeRef.current(next);
  };

  return (
    <div
      className={`hce-editor ${className}`.trim()}
      data-theme={isDarkTheme(theme) ? "dark" : "light"}
      style={{ fontSize: `${fontSize}px`, tabSize }}
    >
      <pre className='hce-highlight' ref={preRef} aria-hidden='true'>
        <code>
          {tokens.map((token, index) => (
            <span key={index} className={token.type ? `hce-${token.type}` : ""}>
              {token.text}
            </span>
          ))}
          {/* Keeps the last line scrollable to the same extent as the textarea. */}
          {"\n"}
        </code>
      </pre>

      <textarea
        ref={textareaRef}
        className='hce-input'
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        autoCapitalize='off'
        autoCorrect='off'
        autoComplete='off'
        aria-label={ariaLabel ?? `${language.toUpperCase()} code`}
      />
    </div>
  );
}

HighlightCodeEditor.canFormat = false;

export default HighlightCodeEditor;
