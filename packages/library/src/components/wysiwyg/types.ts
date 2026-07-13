/**
 * Common props shared by the named, single-purpose toolbar controls
 * (bold, italic, lists, alignment, …).
 */
export interface NamedControlProps {
  /** Additional class name applied to the control button. */
  className?: string;
  /** Accessible label / tooltip. Each control provides a sensible default. */
  title?: string;
}
