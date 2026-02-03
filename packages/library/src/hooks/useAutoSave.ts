import { useState, useEffect, useCallback } from "react";

export type SaveStatus = "saved" | "unsaved" | "saving";

interface ContentValue {
  html: string;
  css: string;
}

interface UseAutoSaveProps {
  value: ContentValue;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
}

interface UseAutoSaveReturn {
  savedValue: ContentValue;
  saveStatus: SaveStatus;
  hasUnsavedChanges: boolean;
  handleSave: () => Promise<void>;
}

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
