import React from "react";
import styles from "./wysiwyg.module.css";

/**
 * Layout container for the editor's formatting controls. Renders a
 * `role="toolbar"` region; compose it from any of the control components.
 */
export interface WysiwygToolbarProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

export const WysiwygToolbar: React.FC<WysiwygToolbarProps> = ({
  children,
  className = "",
  "aria-label": ariaLabel = "Formatting",
}) => (
  <div
    role='toolbar'
    aria-label={ariaLabel}
    className={`${styles.toolbar} ${className}`.trim()}
  >
    {children}
  </div>
);
