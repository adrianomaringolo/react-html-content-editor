import { Check, AlertCircle, Loader2 } from "lucide-react";
import type { SaveStatus } from "../hooks/useAutoSave";
import styles from "./content-editor.module.css";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
}

/**
 * SaveStatusIndicator component displays the current save status
 */
export function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  return (
    <div
      className={`${styles.saveStatus} ${styles[status]}`}
      aria-live='polite'
      aria-atomic='true'
    >
      {status === "saved" && (
        <>
          <Check size={16} aria-hidden='true' />
          <span>Saved</span>
        </>
      )}
      {status === "unsaved" && (
        <>
          <AlertCircle size={16} aria-hidden='true' />
          <span>Unsaved changes</span>
        </>
      )}
      {status === "saving" && (
        <>
          <Loader2 size={16} className={styles.spinner} aria-hidden='true' />
          <span>Saving...</span>
        </>
      )}
    </div>
  );
}
