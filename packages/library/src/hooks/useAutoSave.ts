import { useState, useEffect, useCallback } from "react";

/**
 * Save status state machine representing the current save state.
 *
 * - `saved`: Content has been saved and matches the last saved version
 * - `unsaved`: Content has been modified since last save
 * - `saving`: Save operation is currently in progress
 */
export type SaveStatus = "saved" | "unsaved" | "saving";

/**
 * Represents the HTML and CSS content being edited.
 */
interface ContentValue {
  html: string;
  css: string;
}

/**
 * Props for the useAutoSave hook.
 */
interface UseAutoSaveProps {
  /** The current HTML and CSS content */
  value: ContentValue;
  /** Callback fired when save is triggered. Should return a Promise. */
  onSave?: () => Promise<void>;
  /** Indicates whether a save operation is in progress */
  isSaving?: boolean;
}

/**
 * Return value from the useAutoSave hook.
 */
interface UseAutoSaveReturn {
  /** The last saved content value */
  savedValue: ContentValue;
  /** Current save status */
  saveStatus: SaveStatus;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Function to trigger a save operation */
  handleSave: () => Promise<void>;
}

/**
 * Custom hook for managing auto-save functionality and unsaved changes detection.
 *
 * Tracks the saved value separately from the current value and manages the save status
 * state machine (saved → unsaved → saving → saved/unsaved).
 *
 * @example
 * ```tsx
 * const { saveStatus, hasUnsavedChanges, handleSave } = useAutoSave({
 *   value: { html: '<h1>Hello</h1>', css: 'h1 { color: blue; }' },
 *   onSave: async () => await saveToServer(),
 *   isSaving: false
 * });
 * ```
 *
 * @param {UseAutoSaveProps} props - Hook configuration
 * @returns {UseAutoSaveReturn} Save state and handlers
 */
export function useAutoSave({
  value,
  onSave,
  isSaving = false,
}: UseAutoSaveProps): UseAutoSaveReturn {
  const [savedValue, setSavedValue] = useState<ContentValue>(value);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  // Detect unsaved changes by comparing current value with saved value
  const hasUnsavedChanges =
    value.html !== savedValue.html || value.css !== savedValue.css;

  // Update save status based on changes
  useEffect(() => {
    if (hasUnsavedChanges && saveStatus === "saved") {
      setSaveStatus("unsaved");
    } else if (!hasUnsavedChanges && saveStatus === "unsaved") {
      setSaveStatus("saved");
    }
  }, [hasUnsavedChanges, saveStatus]);

  // Update save status based on external isSaving prop
  useEffect(() => {
    if (isSaving) {
      setSaveStatus("saving");
    }
  }, [isSaving]);

  const handleSave = useCallback(async () => {
    if (!onSave || isSaving) return;

    setSaveStatus("saving");

    try {
      await onSave();
      setSavedValue(value);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("unsaved");
      // Don't re-throw - error is handled by setting status to unsaved
    }
  }, [onSave, isSaving, value]);

  return {
    savedValue,
    saveStatus,
    hasUnsavedChanges,
    handleSave,
  };
}
