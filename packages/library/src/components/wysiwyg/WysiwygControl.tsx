import React from "react";
import styles from "./wysiwyg.module.css";
import { useWysiwygContext } from "./context";

/**
 * The building block every toolbar control is composed from. Use it directly
 * to create custom controls for any `execCommand`, or provide `onActivate`
 * for fully custom behaviour.
 *
 * @example
 * ```tsx
 * <WysiwygControl command="superscript" title="Superscript">x²</WysiwygControl>
 * ```
 */
export interface WysiwygControlProps {
  /** The execCommand identifier to run (e.g. "bold", "insertUnorderedList"). */
  command: string;
  /** Optional value passed to the command (e.g. block tag, url, size). */
  value?: string;
  /** Emit CSS styles instead of presentational tags for this command. */
  useCss?: boolean;
  /** Accessible label / tooltip for the control. */
  title: string;
  /** Override how "active" is determined (defaults to queryCommandState). */
  isActive?: (ctx: {
    isActive: (command: string) => boolean;
    queryValue: (command: string) => string;
  }) => boolean;
  /** Provide a custom handler instead of running the command. */
  onActivate?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const WysiwygControl: React.FC<WysiwygControlProps> = ({
  command,
  value,
  useCss,
  title,
  isActive: isActiveOverride,
  onActivate,
  children,
  className = "",
  disabled: disabledProp = false,
}) => {
  const ctx = useWysiwygContext();
  // `version` is read to re-render on selection changes.
  void ctx.version;

  const active = isActiveOverride
    ? isActiveOverride({ isActive: ctx.isActive, queryValue: ctx.queryValue })
    : ctx.isActive(command);

  const disabled = disabledProp || ctx.disabled;

  return (
    <button
      type='button'
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      // Keep the editor selection intact when the button is pressed.
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        if (disabled) return;
        if (onActivate) onActivate();
        else ctx.exec(command, value, useCss);
      }}
      className={`${styles.control} ${active ? styles.controlActive : ""} ${className}`.trim()}
    >
      {children}
    </button>
  );
};
