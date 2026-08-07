import { useEffect, useRef } from "react";
import ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-monokai";
import beautify from "ace-builds/src-noconflict/ext-beautify";
import type {
  CodeEditorHandle,
  CodeEditorProps,
} from "react-html-content-editor";
import { isDarkTheme, numberOption } from "./options";

/**
 * Ace adapter for `ContentEditor`'s `codeEditor` prop.
 *
 * Unlike the CodeMirror adapter this one reports `canFormat = true`: Ace's
 * `ext-beautify` reformats HTML and CSS, so the toolbar's Format action stays
 * visible and works without Monaco.
 *
 * ```bash
 * npm install ace-builds
 * ```
 *
 * @example
 * ```tsx
 * <ContentEditor value={value} onChange={setValue} codeEditor={AceCodeEditor} />
 * ```
 */
export function AceCodeEditor({
  defaultValue,
  language,
  theme,
  options,
  onChange,
  onReady,
  className = "",
  ariaLabel,
}: CodeEditorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<ReturnType<typeof ace.edit> | null>(null);

  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onChangeRef.current = onChange;
    onReadyRef.current = onReady;
  }, [onChange, onReady]);

  const seedRef = useRef({ defaultValue, language, theme, options, ariaLabel });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const seed = seedRef.current;
    const editor = ace.edit(host, {
      value: seed.defaultValue,
      mode: `ace/mode/${seed.language}`,
      theme: isDarkTheme(seed.theme)
        ? "ace/theme/monokai"
        : "ace/theme/chrome",
      fontSize: numberOption(seed.options, "fontSize", 14),
      tabSize: numberOption(seed.options, "tabSize", 2),
      readOnly: seed.options?.readOnly === true,
      wrap: true,
      showPrintMargin: false,
      // Ace's syntax workers are separate files. Turning them off keeps the
      // adapter to a single import and costs only the inline lint warnings.
      useWorker: false,
    });
    editorRef.current = editor;
    editor.renderer.setScrollMargin(8, 8, 0, 0);
    editor.textInput.getElement().setAttribute(
      "aria-label",
      seed.ariaLabel ?? `${seed.language.toUpperCase()} code`,
    );

    const handleChange = () => onChangeRef.current(editor.getValue());
    editor.on("change", handleChange);

    // Ace measures its own size once and does not observe the container, so
    // split-view and fullscreen toggles have to tell it to re-layout.
    const resizeObserver = new ResizeObserver(() => editor.resize());
    resizeObserver.observe(host);

    const scrollListeners = new Set<() => void>();
    const notify = () => scrollListeners.forEach((listener) => listener());
    editor.session.on("changeScrollTop", notify);

    const handle: CodeEditorHandle = {
      focus: () => editor.focus(),
      format: () => {
        beautify.beautify(editor.session);
        return true;
      },
      getScrollTop: () => editor.session.getScrollTop(),
      getMaxScroll: () => {
        const { maxHeight } = editor.renderer.layerConfig;
        const viewport = editor.renderer.$size.scrollerHeight;
        return Math.max(0, maxHeight - viewport);
      },
      setScrollTop: (top) => editor.session.setScrollTop(top),
      onScroll: (listener) => {
        scrollListeners.add(listener);
        return () => scrollListeners.delete(listener);
      },
    };
    onReadyRef.current?.(handle);

    return () => {
      resizeObserver.disconnect();
      editor.session.off("changeScrollTop", notify);
      editor.off("change", handleChange);
      scrollListeners.clear();
      onReadyRef.current?.(null);
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    editorRef.current?.setTheme(
      isDarkTheme(theme) ? "ace/theme/monokai" : "ace/theme/chrome",
    );
  }, [theme]);

  return (
    <div
      ref={hostRef}
      className={className}
      // Ace absolutely positions its layers, so the host has to establish a
      // positioning context and a real height.
      style={{ flex: 1, minHeight: 0, minWidth: 0, position: "relative" }}
    />
  );
}

AceCodeEditor.canFormat = true;

export default AceCodeEditor;
