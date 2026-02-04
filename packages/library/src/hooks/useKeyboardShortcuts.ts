import { useEffect } from "react";

/**
 * Props for the useKeyboardShortcuts hook.
 */
interface UseKeyboardShortcutsProps {
  /** Callback fired when save shortcut is triggered */
  onSave?: () => void;
  /** Whether save can be performed (typically false when there are unsaved changes) */
  canSave: boolean;
}

/**
 * Custom hook for managing keyboard shortcuts in the editor.
 *
 * Listens for Ctrl+S / Cmd+S to trigger save and handles the beforeunload event
 * to warn users about unsaved changes when leaving the page.
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   onSave: handleSave,
 *   canSave: !hasUnsavedChanges
 * });
 * ```
 *
 * @param {UseKeyboardShortcutsProps} props - Hook configuration
 * @returns {void}
 */
export function useKeyboardShortcuts({
  onSave,
  canSave,
}: UseKeyboardShortcutsProps): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();

        if (onSave && canSave) {
          onSave();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave, canSave]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!canSave) {
        // If there are unsaved changes, show browser warning
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [canSave]);
}
