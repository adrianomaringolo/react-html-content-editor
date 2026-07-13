/**
 * React HTML Content Editor
 *
 * A sophisticated HTML and CSS content editor built with Monaco Editor.
 * Features multiple view modes, real-time preview, scroll synchronization,
 * and auto-save functionality.
 *
 * @packageDocumentation
 */

// Import styles
import "./components/button.module.css";
import "./components/tabs.module.css";
import "./components/dialog.module.css";
import "./components/content-editor.module.css";
import "./components/wysiwyg/wysiwyg.module.css";

// Main library entry point
export type {
  ContentValue,
  ContentEditorProps,
  SaveStatus,
  ViewMode,
  EditorType,
} from "./types";

// Export UI components
export {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  ContentEditor,
  ContentEditorProvider,
  ContentEditorShell,
  ContentEditorToolbar,
  ContentEditorBody,
  ContentEditorCode,
  ContentEditorPreview,
  ContentEditorWysiwyg,
  useContentEditorContext,
  Wysiwyg,
  WysiwygToolbar,
  WysiwygSeparator,
  WysiwygControl,
  WysiwygBold,
  WysiwygItalic,
  WysiwygUnderline,
  WysiwygStrikethrough,
  WysiwygHeading,
  WysiwygParagraph,
  WysiwygBlockquote,
  WysiwygUnorderedList,
  WysiwygOrderedList,
  WysiwygAlign,
  WysiwygLink,
  WysiwygUnlink,
  WysiwygImage,
  WysiwygImageUpload,
  WysiwygImageResizer,
  WysiwygFontSize,
  WysiwygClearFormatting,
  WysiwygContent,
  useWysiwygContext,
} from "./components";

export type {
  ContentEditorProviderProps,
  ContentEditorShellProps,
  ContentEditorToolbarProps,
  ContentEditorBodyProps,
  ContentEditorCodeProps,
  ContentEditorPreviewProps,
  ContentEditorWysiwygProps,
  ContentEditorContextValue,
  ContentEditorMode,
  ButtonProps,
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
  WysiwygProps,
  WysiwygToolbarProps,
  WysiwygControlProps,
  WysiwygHeadingProps,
  WysiwygAlignProps,
  WysiwygLinkProps,
  WysiwygImageProps,
  WysiwygImageUploadProps,
  WysiwygImageResizerProps,
  WysiwygImageSizeOption,
  WysiwygFontSizeProps,
  WysiwygFontSizeOption,
  WysiwygContentProps,
  WysiwygContextValue,
  NamedControlProps,
} from "./components";

// Export hooks for advanced usage
export { useScrollSync, useAutoSave, useKeyboardShortcuts } from "./hooks";

/**
 * Library version
 */
import packageJson from "../package.json";
export const version = packageJson.version;
