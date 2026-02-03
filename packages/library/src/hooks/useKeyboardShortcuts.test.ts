import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  beforeEach(() => {
    // Clear all event listeners before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any remaining event listeners
    vi.restoreAllMocks();
  });

  it("should trigger save when Ctrl+S is pressed", () => {
    const onSave = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onSave,
        canSave: true,
      }),
    );

    // Simulate Ctrl+S keydown event
    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("should trigger save when Cmd+S is pressed (Mac)", () => {
    const onSave = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onSave,
        canSave: true,
      }),
    );

    // Simulate Cmd+S keydown event (metaKey for Mac)
    const event = new KeyboardEvent("keydown", {
      key: "s",
      metaKey: true,
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("should not trigger save when canSave is false", () => {
    const onSave = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onSave,
        canSave: false,
      }),
    );

    // Simulate Ctrl+S keydown event
    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    window.dispatchEvent(event);

    // Should still prevent default but not call onSave
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("should not trigger save when onSave is undefined", () => {
    renderHook(() =>
      useKeyboardShortcuts({
        onSave: undefined,
        canSave: true,
      }),
    );

    // Simulate Ctrl+S keydown event
    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    window.dispatchEvent(event);

    // Should still prevent default
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should show beforeunload warning when there are unsaved changes", () => {
    renderHook(() =>
      useKeyboardShortcuts({
        onSave: vi.fn(),
        canSave: false, // canSave false means there are unsaved changes
      }),
    );

    // Simulate beforeunload event
    const event = new Event("beforeunload", {
      bubbles: true,
      cancelable: true,
    }) as BeforeUnloadEvent;

    // Initialize returnValue as empty string (browser default)
    Object.defineProperty(event, "returnValue", {
      writable: true,
      value: "",
    });

    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(event.returnValue).toBe("");
  });

  it("should not show beforeunload warning when saved", () => {
    renderHook(() =>
      useKeyboardShortcuts({
        onSave: vi.fn(),
        canSave: true, // canSave true means no unsaved changes
      }),
    );

    // Simulate beforeunload event
    const event = new Event("beforeunload", {
      bubbles: true,
      cancelable: true,
    }) as BeforeUnloadEvent;

    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    window.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
    expect(event.returnValue).not.toBe("");
  });

  it("should clean up event listeners on unmount", () => {
    const onSave = vi.fn();
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({
        onSave,
        canSave: true,
      }),
    );

    unmount();

    // Should remove both keydown and beforeunload listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );
  });

  it("should update event listeners when canSave changes", () => {
    const onSave = vi.fn();

    const { rerender } = renderHook(
      ({ canSave }) =>
        useKeyboardShortcuts({
          onSave,
          canSave,
        }),
      {
        initialProps: { canSave: true },
      },
    );

    // Trigger save with canSave true
    const event1 = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event1);
    expect(onSave).toHaveBeenCalledTimes(1);

    // Change canSave to false
    rerender({ canSave: false });

    // Try to trigger save again
    const event2 = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event2);

    // Should not call onSave again
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
