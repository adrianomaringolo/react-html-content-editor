import React from "react";
import styles from "./wysiwyg.module.css";

/**
 * A vertical divider for visually grouping related toolbar controls.
 */
export const WysiwygSeparator: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <span
    role='separator'
    aria-orientation='vertical'
    className={`${styles.separator} ${className}`.trim()}
  />
);
