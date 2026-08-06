import { TextareaCodeEditor } from "../components/code-editor/TextareaCodeEditor";
import type {
  CodeEditorComponent,
  CodeEditorProps,
} from "../components/code-editor/types";

/**
 * Test double for a code editor that advertises formatting support, standing in
 * for `MonacoCodeEditor` (which cannot render in jsdom). Behaves like the
 * built-in textarea editor otherwise, so tests can exercise the Format action
 * and its toolbar affordances.
 */
export const FormattingCodeEditor: CodeEditorComponent = (
  props: CodeEditorProps,
) => <TextareaCodeEditor {...props} />;

FormattingCodeEditor.canFormat = true;
