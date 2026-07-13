// Root
export { Wysiwyg } from "./Wysiwyg";
export type { WysiwygProps } from "./Wysiwyg";

// Layout
export { WysiwygToolbar } from "./WysiwygToolbar";
export type { WysiwygToolbarProps } from "./WysiwygToolbar";
export { WysiwygSeparator } from "./WysiwygSeparator";
export { WysiwygContent } from "./WysiwygContent";
export type { WysiwygContentProps } from "./WysiwygContent";

// Generic building block
export { WysiwygControl } from "./WysiwygControl";
export type { WysiwygControlProps } from "./WysiwygControl";

// Inline formatting
export { WysiwygBold } from "./WysiwygBold";
export { WysiwygItalic } from "./WysiwygItalic";
export { WysiwygUnderline } from "./WysiwygUnderline";
export { WysiwygStrikethrough } from "./WysiwygStrikethrough";
export { WysiwygFontSize } from "./WysiwygFontSize";
export type {
  WysiwygFontSizeProps,
  WysiwygFontSizeOption,
} from "./WysiwygFontSize";

// Block formatting
export { WysiwygHeading } from "./WysiwygHeading";
export type { WysiwygHeadingProps } from "./WysiwygHeading";
export { WysiwygParagraph } from "./WysiwygParagraph";
export { WysiwygBlockquote } from "./WysiwygBlockquote";

// Lists & alignment
export { WysiwygUnorderedList } from "./WysiwygUnorderedList";
export { WysiwygOrderedList } from "./WysiwygOrderedList";
export { WysiwygAlign } from "./WysiwygAlign";
export type { WysiwygAlignProps } from "./WysiwygAlign";

// Links & utilities
export { WysiwygLink } from "./WysiwygLink";
export type { WysiwygLinkProps } from "./WysiwygLink";
export { WysiwygUnlink } from "./WysiwygUnlink";
export { WysiwygClearFormatting } from "./WysiwygClearFormatting";

// Shared context (for building advanced custom controls)
export { useWysiwygContext } from "./context";
export type { WysiwygContextValue } from "./context";
export type { NamedControlProps } from "./types";
