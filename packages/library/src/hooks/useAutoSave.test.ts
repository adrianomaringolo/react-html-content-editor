import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAutoSave } from "./useAutoSave";
import fc from "fast-check";

// Feature: react-html-content-editor, Property 8: Save Status State Machine
// Validates: Requirements 3.12, 3.13

describe("useAutoSave - Property 8: Save Status State Machine", () => {
  it("should transition from saved to unsaved when content changes", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string(),
          css: fc.string(),
        }),
        fc.string(),
        fc.string(),
        (initialValue, newHtml, newCss) => {
          // Skip if values are the same
          if (initialValue.html === newHtml && initialValue.css === newCss) {
            return true;
          }

          const { result, rerender } = renderHook(
            ({ value }) => useAutoSave({ value }),
            {
              initialProps: { value: initialValue },
            },
          );

          // Initial state should be saved
          expect(result.current.saveStatus).toBe("saved");
          expect(result.current.hasUnsavedChanges).toBe(false);

          // Change the value
          const newValue = { html: newHtml, css: newCss };
          rerender({ value: newValue });

          // Should transition to unsaved
          expect(result.current.saveStatus).toBe("unsaved");
          expect(result.current.hasUnsavedChanges).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should transition from unsaved to saving to saved on successful save", async () => {
    fc.assert(
      await fc.asyncProperty(
        fc.record({
          html: fc.string(),
          css: fc.string(),
        }),
        fc.string(),
        async (initialValue, newHtml) => {
          // Skip if values are the same
          if (initialValue.html === newHtml) {
            return true;
          }

          const onSave = vi.fn().mockResolvedValue(undefined);
          const newValue = { ...initialValue, html: newHtml };

          const { result, rerender } = renderHook(
            ({ value, onSave }) => useAutoSave({ value, onSave }),
            {
              initialProps: { value: initialValue, onSave },
            },
          );

          // Change the value
          rerender({ value: newValue, onSave });

          // Should be unsaved
          expect(result.current.saveStatus).toBe("unsaved");

          // Trigger save
          await act(async () => {
            await result.current.handleSave();
          });

          // Should transition to saved
          await waitFor(() => {
            expect(result.current.saveStatus).toBe("saved");
          });
          expect(result.current.hasUnsavedChanges).toBe(false);
          expect(onSave).toHaveBeenCalled();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should transition from saving to unsaved on failed save", async () => {
    fc.assert(
      await fc.asyncProperty(
        fc.record({
          html: fc.string(),
          css: fc.string(),
        }),
        fc.string(),
        async (initialValue, newHtml) => {
          // Skip if values are the same
          if (initialValue.html === newHtml) {
            return true;
          }

          const saveError = new Error("Save failed");
          const onSave = vi.fn().mockRejectedValue(saveError);
          const newValue = { ...initialValue, html: newHtml };

          const { result, rerender } = renderHook(
            ({ value, onSave }) => useAutoSave({ value, onSave }),
            {
              initialProps: { value: initialValue, onSave },
            },
          );

          // Change the value
          rerender({ value: newValue, onSave });

          // Should be unsaved
          expect(result.current.saveStatus).toBe("unsaved");

          // Trigger save (should fail)
          await act(async () => {
            try {
              await result.current.handleSave();
            } catch (error) {
              // Expected to throw
            }
          });

          // Should remain unsaved after failure
          await waitFor(() => {
            expect(result.current.saveStatus).toBe("unsaved");
          });
          expect(result.current.hasUnsavedChanges).toBe(true);
          expect(onSave).toHaveBeenCalled();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should respect external isSaving prop", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string(),
          css: fc.string(),
        }),
        (value) => {
          const { result, rerender } = renderHook(
            ({ isSaving }) => useAutoSave({ value, isSaving }),
            {
              initialProps: { isSaving: false },
            },
          );

          // Initial state
          expect(result.current.saveStatus).toBe("saved");

          // Set isSaving to true
          rerender({ isSaving: true });

          // Should transition to saving
          expect(result.current.saveStatus).toBe("saving");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should not save when already saving", async () => {
    fc.assert(
      await fc.asyncProperty(
        fc.record({
          html: fc.string(),
          css: fc.string(),
        }),
        async (value) => {
          const onSave = vi.fn().mockResolvedValue(undefined);

          const { result } = renderHook(() =>
            useAutoSave({ value, onSave, isSaving: true }),
          );

          // Try to save while already saving
          await act(async () => {
            await result.current.handleSave();
          });

          // onSave should not be called
          expect(onSave).not.toHaveBeenCalled();
        },
      ),
      { numRuns: 100 },
    );
  });
});
