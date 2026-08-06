import { useCallback, useRef } from "react";
import type { CodeEditorHandle } from "../components/code-editor/types";

/**
 * Props for the useScrollSync hook.
 */
interface UseScrollSyncProps {
  /** Reference to the code editor handle (see {@link CodeEditorHandle}) */
  editorRef: React.RefObject<CodeEditorHandle | null>;
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
 * const editorRef = useRef<CodeEditorHandle | null>(null);
 * const previewRef = useRef<HTMLDivElement | null>(null);
 *
 * const { handleEditorScroll, handlePreviewScroll } = useScrollSync({
 *   editorRef,
 *   previewRef,
 *   enabled: true
 * });
 *
 * // Attach to editor
 * useEffect(
 *   () => editorRef.current?.onScroll(handleEditorScroll),
 *   [handleEditorScroll],
 * );
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
    const maxScroll = editor.getMaxScroll();

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

      isScrollingSyncRef.current = true;
      editor.setScrollTop(scrollPercent * editor.getMaxScroll());

      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false;
      });
    },
    [enabled, editorRef],
  );

  return { handleEditorScroll, handlePreviewScroll };
}
