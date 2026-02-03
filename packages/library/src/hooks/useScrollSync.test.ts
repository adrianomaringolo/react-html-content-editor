import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollSync } from "./useScrollSync";
import fc from "fast-check";
import type { editor } from "monaco-editor";

// Feature: react-html-content-editor, Property 4: Scroll Synchronization Proportionality
// Validates: Requirements 4.1, 4.2

describe("useScrollSync - Property 4: Scroll Synchronization Proportionality", () => {
  it("should synchronize scroll position proportionally from editor to preview", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }), // scrollTop
        fc.integer({ min: 100, max: 20000 }), // scrollHeight
        fc.integer({ min: 50, max: 1000 }), // clientHeight
        fc.integer({ min: 100, max: 20000 }), // preview scrollHeight
        fc.integer({ min: 50, max: 1000 }), // preview clientHeight
        (
          scrollTop,
          scrollHeight,
          clientHeight,
          previewScrollHeight,
          previewClientHeight,
        ) => {
          // Ensure valid scroll dimensions
          if (
            scrollHeight <= clientHeight ||
            previewScrollHeight <= previewClientHeight
          ) {
            return true; // Skip invalid cases
          }

          const maxScroll = scrollHeight - clientHeight;
          if (scrollTop > maxScroll) {
            return true; // Skip invalid scroll positions
          }

          // Create mock editor
          const mockEditor = {
            getScrollTop: vi.fn(() => scrollTop),
            getScrollHeight: vi.fn(() => scrollHeight),
            getLayoutInfo: vi.fn(() => ({ height: clientHeight })),
            setScrollTop: vi.fn(),
          } as unknown as editor.IStandaloneCodeEditor;

          // Create mock preview element
          const mockPreview = {
            scrollTop: 0,
            scrollHeight: previewScrollHeight,
            clientHeight: previewClientHeight,
          } as HTMLDivElement;

          const editorRef = { current: mockEditor };
          const previewRef = { current: mockPreview };

          const { result } = renderHook(() =>
            useScrollSync({
              editorRef,
              previewRef,
              enabled: true,
            }),
          );

          // Trigger editor scroll
          act(() => {
            result.current.handleEditorScroll();
          });

          // Calculate expected scroll position
          const scrollPercent = scrollTop / maxScroll;
          const previewMaxScroll = previewScrollHeight - previewClientHeight;
          const expectedPreviewScrollTop = scrollPercent * previewMaxScroll;

          // Verify proportional scroll
          expect(mockPreview.scrollTop).toBeCloseTo(
            expectedPreviewScrollTop,
            1,
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should synchronize scroll position proportionally from preview to editor", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }), // preview scrollTop
        fc.integer({ min: 100, max: 20000 }), // preview scrollHeight
        fc.integer({ min: 50, max: 1000 }), // preview clientHeight
        fc.integer({ min: 100, max: 20000 }), // editor scrollHeight
        fc.integer({ min: 50, max: 1000 }), // editor clientHeight
        (
          previewScrollTop,
          previewScrollHeight,
          previewClientHeight,
          editorScrollHeight,
          editorClientHeight,
        ) => {
          // Ensure valid scroll dimensions
          if (
            previewScrollHeight <= previewClientHeight ||
            editorScrollHeight <= editorClientHeight
          ) {
            return true; // Skip invalid cases
          }

          const previewMaxScroll = previewScrollHeight - previewClientHeight;
          if (previewScrollTop > previewMaxScroll) {
            return true; // Skip invalid scroll positions
          }

          // Create mock editor
          const mockEditor = {
            getScrollTop: vi.fn(() => 0),
            getScrollHeight: vi.fn(() => editorScrollHeight),
            getLayoutInfo: vi.fn(() => ({ height: editorClientHeight })),
            setScrollTop: vi.fn(),
          } as unknown as editor.IStandaloneCodeEditor;

          // Create mock preview element
          const mockPreview = {
            scrollTop: previewScrollTop,
            scrollHeight: previewScrollHeight,
            clientHeight: previewClientHeight,
          } as HTMLDivElement;

          const editorRef = { current: mockEditor };
          const previewRef = { current: mockPreview };

          const { result } = renderHook(() =>
            useScrollSync({
              editorRef,
              previewRef,
              enabled: true,
            }),
          );

          // Trigger preview scroll
          const mockEvent = {
            currentTarget: mockPreview,
          } as React.UIEvent<HTMLDivElement>;

          act(() => {
            result.current.handlePreviewScroll(mockEvent);
          });

          // Calculate expected scroll position
          const scrollPercent = previewScrollTop / previewMaxScroll;
          const editorMaxScroll = editorScrollHeight - editorClientHeight;
          const expectedEditorScrollTop = scrollPercent * editorMaxScroll;

          // Verify proportional scroll
          expect(mockEditor.setScrollTop).toHaveBeenCalledWith(
            expect.closeTo(expectedEditorScrollTop, 1),
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should not synchronize when disabled", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        fc.integer({ min: 100, max: 20000 }),
        fc.integer({ min: 50, max: 1000 }),
        (scrollTop, scrollHeight, clientHeight) => {
          if (scrollHeight <= clientHeight) {
            return true;
          }

          const mockEditor = {
            getScrollTop: vi.fn(() => scrollTop),
            getScrollHeight: vi.fn(() => scrollHeight),
            getLayoutInfo: vi.fn(() => ({ height: clientHeight })),
            setScrollTop: vi.fn(),
          } as unknown as editor.IStandaloneCodeEditor;

          const mockPreview = {
            scrollTop: 0,
            scrollHeight: 1000,
            clientHeight: 500,
          } as HTMLDivElement;

          const editorRef = { current: mockEditor };
          const previewRef = { current: mockPreview };

          const { result } = renderHook(() =>
            useScrollSync({
              editorRef,
              previewRef,
              enabled: false, // Disabled
            }),
          );

          const initialScrollTop = mockPreview.scrollTop;

          act(() => {
            result.current.handleEditorScroll();
          });

          // Verify no scroll happened
          expect(mockPreview.scrollTop).toBe(initialScrollTop);
        },
      ),
      { numRuns: 100 },
    );
  });
});
