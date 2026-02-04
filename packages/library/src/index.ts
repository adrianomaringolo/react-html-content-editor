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
} from "./components";

export type {
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
} from "./components";

// Export hooks for advanced usage
export { useScrollSync, useAutoSave, useKeyboardShortcuts } from "./hooks";

/**
 * Library version
 */
export const version = "0.1.0";
