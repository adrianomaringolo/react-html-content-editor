import React from "react";
import {
  Info,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  type LucideIcon,
} from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

/** A callout variant offered by {@link WysiwygCallout}. */
export interface WysiwygCalloutVariant {
  label: string;
  /** Written to `data-wysiwyg-callout`; drives the box color. */
  value: string;
}

const DEFAULT_VARIANTS: WysiwygCalloutVariant[] = [
  { label: "Info", value: "info" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Danger", value: "danger" },
];

const VARIANT_ICONS: Record<string, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
};

/** Insert a colored callout / info box the reader can type into. */
export interface WysiwygCalloutProps extends NamedControlProps {
  variants?: WysiwygCalloutVariant[];
}

export const WysiwygCallout: React.FC<WysiwygCalloutProps> = ({
  className,
  title = "Callout",
  variants = DEFAULT_VARIANTS,
}) => {
  const { exec } = useWysiwygContext();

  const insert = (variant: string) =>
    exec(
      "insertHTML",
      `<div data-wysiwyg-callout="${variant}"><p><br></p></div><p><br></p>`,
    );

  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<Info size={16} aria-hidden='true' />}
    >
      <div className={styles.menuList}>
        {variants.map((variant) => {
          const Icon = VARIANT_ICONS[variant.value] ?? Info;
          return (
            <button
              key={variant.value}
              type='button'
              role='menuitem'
              aria-label={variant.label}
              className={styles.menuItem}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insert(variant.value)}
            >
              <span
                className={styles.calloutSwatch}
                data-wysiwyg-callout={variant.value}
                aria-hidden='true'
              >
                <Icon size={14} />
              </span>
              {variant.label}
            </button>
          );
        })}
      </div>
    </WysiwygDropdown>
  );
};
