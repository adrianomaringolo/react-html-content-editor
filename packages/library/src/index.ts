// Main library entry point
export type { ContentValue, ContentEditorProps } from "./types";

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

// Version
export const version = "0.1.0";
