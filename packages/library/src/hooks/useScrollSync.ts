import { useCallback, useRef } from "react";
import type { editor } from "monaco-editor";

/**
 * Props for the useScrollSync hook.
 */
interface UseScrollSyncProps {
  /** Reference to the Monaco Editor instance */
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
  /** Reference to the preview container element */
  previewRef: React.RefObject<HTMLDivElement | null>;
  /** Whether scroll synchronization is enabled */
  enabled: boolean;
}

/**
 * Return value from the useScrollSync hook.
 */
interface UseScrollSyncReturn {
  /** Handler for editor scroll events */
  handleEditorScroll: () => void;
  /** Handler for preview scroll events */
  handlePreviewScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Custom hook for managing scroll synchronization between editor and preview.
 *
 * Calculates scroll percentage in the source element and applies the same percentage
 * to the target element. Uses a ref to prevent infinite scroll loops and debounces
 * scroll events for performance.
 *
 * @example
 * ```tsx
 * const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
 * const previewRef = useRef<HTMLDivElement | null>(null);
 *
 * const { handleEditorScroll, handlePreviewScroll } = useScrollSync({
 *   editorRef,
 *   previewRef,
 *   enabled: true
 * });
 *
 * // Attach to editor
 * useEffect(() => {
 *   const disposable = editorRef.current?.onDidScrollChange(() => {
 *     handleEditorScroll();
 *   });
 *   return () => disposable?.dispose();
 * }, [handleEditorScroll]);
 * ```
 *
 * @param {UseScrollSyncProps} props - Hook configuration
 * @returns {UseScrollSyncReturn} Scroll event handlers
 */
export function useScrollSync({
  editorRef,
  previewRef,
  enabled,
}: UseScrollSyncProps): UseScrollSyncReturn {
  const isScrollingSyncRef = useRef(false);

  const handleEditorScroll = useCallback(() => {
    if (
      !enabled ||
      isScrollingSyncRef.current ||
      !previewRef.current ||
      !editorRef.current
    ) {
      return;
    }

    const editor = editorRef.current;
    const preview = previewRef.current;

    const scrollTop = editor.getScrollTop();
    const scrollHeight = editor.getScrollHeight();
    const clientHeight = editor.getLayoutInfo().height;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) return;

    const scrollPercent = scrollTop / maxScroll;
    const previewMaxScroll = preview.scrollHeight - preview.clientHeight;

    isScrollingSyncRef.current = true;
    preview.scrollTop = scrollPercent * previewMaxScroll;

    requestAnimationFrame(() => {
      isScrollingSyncRef.current = false;
    });
  }, [enabled, editorRef, previewRef]);

  const handlePreviewScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!enabled || isScrollingSyncRef.current || !editorRef.current) {
        return;
      }

      const preview = e.currentTarget;
      const editor = editorRef.current;

      const scrollTop = preview.scrollTop;
      const maxScroll = preview.scrollHeight - preview.clientHeight;

      if (maxScroll <= 0) return;

      const scrollPercent = scrollTop / maxScroll;
      const editorMaxScroll =
        editor.getScrollHeight() - editor.getLayoutInfo().height;

      isScrollingSyncRef.current = true;
      editor.setScrollTop(scrollPercent * editorMaxScroll);

      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false;
      });
    },
    [enabled, editorRef],
  );

  return { handleEditorScroll, handlePreviewScroll };
}
