import { useCallback, useRef } from "react";
import type { editor } from "monaco-editor";

interface UseScrollSyncProps {
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
  previewRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
}

interface UseScrollSyncReturn {
  handleEditorScroll: () => void;
  handlePreviewScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

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
