import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import type {
  CodeEditorHandle,
  CodeEditorProps,
} from "react-html-content-editor";
import { isDarkTheme, numberOption } from "./options";

/**
 * CodeMirror 6 adapter for `ContentEditor`'s `codeEditor` prop.
 *
 * Nothing here is library-specific: it is an ordinary CodeMirror `EditorView`
 * plus the two things the contract asks for — edits reported through
 * `onChange`, and a {@link CodeEditorHandle} handed back via `onReady`.
 *
 * ```bash
 * npm install codemirror @codemirror/state @codemirror/view \
 *   @codemirror/lang-html @codemirror/lang-css @codemirror/theme-one-dark
 * ```
 *
 * @example
 * ```tsx
 * <ContentEditor value={value} onChange={setValue} codeEditor={CodeMirrorCodeEditor} />
 * ```
 */
export function CodeMirrorCodeEditor({
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
  const viewRef = useRef<EditorView | null>(null);

  // Lets the theme be swapped without tearing the view down, so the cursor,
  // selection and undo history survive a light/dark toggle.
  const themeSlot = useRef(new Compartment()).current;

  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onChangeRef.current = onChange;
    onReadyRef.current = onReady;
  }, [onChange, onReady]);

  // The view is built once. These are the values it is seeded with; a pane
  // that needs different ones remounts the editor.
  const seedRef = useRef({ defaultValue, language, theme, options, ariaLabel });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const seed = seedRef.current;
    const scrollListeners = new Set<() => void>();
    const notify = () => scrollListeners.forEach((listener) => listener());

    const view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: seed.defaultValue,
        extensions: [
          basicSetup,
          seed.language === "css" ? css() : html(),
          EditorView.lineWrapping,
          EditorState.tabSize.of(numberOption(seed.options, "tabSize", 2)),
          EditorState.readOnly.of(seed.options?.readOnly === true),
          EditorView.contentAttributes.of({
            "aria-label": seed.ariaLabel ?? `${seed.language.toUpperCase()} code`,
          }),
          // The pane sizes the editor; CodeMirror fills it.
          EditorView.theme({ "&": { height: "100%" } }),
          themeSlot.of(isDarkTheme(seed.theme) ? oneDark : []),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
        ],
      }),
    });
    viewRef.current = view;
    view.scrollDOM.addEventListener("scroll", notify);

    const handle: CodeEditorHandle = {
      focus: () => view.focus(),
      // CodeMirror 6 ships no formatter of its own — reporting false hides the
      // toolbar's Format action instead of leaving a button that does nothing.
      format: () => false,
      getScrollTop: () => view.scrollDOM.scrollTop,
      getMaxScroll: () =>
        Math.max(0, view.scrollDOM.scrollHeight - view.scrollDOM.clientHeight),
      setScrollTop: (top) => {
        view.scrollDOM.scrollTop = top;
      },
      onScroll: (listener) => {
        scrollListeners.add(listener);
        return () => scrollListeners.delete(listener);
      },
    };
    onReadyRef.current?.(handle);

    return () => {
      view.scrollDOM.removeEventListener("scroll", notify);
      scrollListeners.clear();
      onReadyRef.current?.(null);
      view.destroy();
      viewRef.current = null;
    };
  }, [themeSlot]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: themeSlot.reconfigure(isDarkTheme(theme) ? oneDark : []),
    });
  }, [theme, themeSlot]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        fontSize: `${numberOption(options, "fontSize", 14)}px`,
      }}
    />
  );
}

CodeMirrorCodeEditor.canFormat = false;

export default CodeMirrorCodeEditor;
