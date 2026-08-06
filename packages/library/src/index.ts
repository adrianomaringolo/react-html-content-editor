/**
 * React HTML Content Editor
 *
 * A sophisticated HTML and CSS content editor. Features multiple view modes,
 * real-time preview, scroll synchronization, and auto-save functionality.
 *
 * Code editing runs on the dependency-free `TextareaCodeEditor` by default.
 * For Monaco, install `@monaco-editor/react` and pass `MonacoCodeEditor` from
 * `react-html-content-editor/monaco` via the `codeEditor` prop.
 *
 * @packageDocumentation
 */

// Import styles
import "./components/button.module.css";
import "./components/tabs.module.css";
import "./components/dialog.module.css";
import "./components/content-editor.module.css";
import "./components/code-editor/textarea-code-editor.module.css";
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
  TextareaCodeEditor,
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
  WysiwygDropdown,
  WysiwygBold,
  WysiwygItalic,
  WysiwygUnderline,
  WysiwygStrikethrough,
  WysiwygSubscript,
  WysiwygSuperscript,
  WysiwygInlineCode,
  WysiwygFontSizeInput,
  WysiwygFontFamily,
  WysiwygTextColor,
  WysiwygClearColor,
  WysiwygCaseTransform,
  WysiwygLineHeight,
  WysiwygLetterSpacing,
  WysiwygHighlight,
  WysiwygEmoji,
  WysiwygSpecialChar,
  WysiwygHeading,
  WysiwygHeadingMenu,
  WysiwygParagraph,
  WysiwygBlockquote,
  WysiwygCodeBlock,
  WysiwygHorizontalRule,
  WysiwygIndent,
  WysiwygOutdent,
  WysiwygUnorderedList,
  WysiwygOrderedList,
  WysiwygTaskList,
  WysiwygAlign,
  WysiwygAlignMenu,
  WysiwygUndo,
  WysiwygRedo,
  WysiwygLink,
  WysiwygUnlink,
  WysiwygLinkEditor,
  WysiwygTable,
  WysiwygTableEditor,
  WysiwygCallout,
  WysiwygTableOfContents,
  WysiwygFindReplace,
  WysiwygPrint,
  WysiwygExport,
  htmlToMarkdown,
  WysiwygImage,
  WysiwygImageUpload,
  WysiwygImageResizer,
  WysiwygFontSize,
  WysiwygClearFormatting,
  WysiwygFullscreen,
  WysiwygWordCount,
  WysiwygContent,
  useWysiwygContext,
} from "./components";

export type {
  CodeEditorComponent,
  CodeEditorHandle,
  CodeEditorProps,
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
  WysiwygDropdownProps,
  WysiwygHeadingProps,
  WysiwygHeadingMenuProps,
  WysiwygAlignProps,
  WysiwygAlignMenuProps,
  WysiwygFontSizeInputProps,
  WysiwygFontFamilyProps,
  WysiwygFontFamilyOption,
  WysiwygTextColorProps,
  WysiwygCaseTransformProps,
  WysiwygCaseMode,
  WysiwygLineHeightProps,
  WysiwygLineHeightOption,
  WysiwygLetterSpacingProps,
  WysiwygLetterSpacingOption,
  WysiwygHighlightProps,
  WysiwygEmojiProps,
  WysiwygSpecialCharProps,
  WysiwygWordCountProps,
  WysiwygLinkProps,
  WysiwygLinkEditorProps,
  WysiwygTableProps,
  WysiwygTableEditorProps,
  WysiwygCalloutProps,
  WysiwygCalloutVariant,
  WysiwygPrintProps,
  WysiwygExportProps,
  WysiwygExportFormat,
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
