import { Editor, OnMount } from "@monaco-editor/react";
import styles from "./content-editor.module.css";

interface MonacoEditorWrapperProps {
  editorKey: string;
  defaultValue: string;
  language: "html" | "css";
  theme: string;
  options: any;
  onChange: (value: string | undefined) => void;
  onMount: OnMount;
}

/**
 * MonacoEditorWrapper component wraps the Monaco Editor with consistent styling
 */
export function MonacoEditorWrapper({
  editorKey,
  defaultValue,
  language,
  theme,
  options,
  onChange,
  onMount,
}: MonacoEditorWrapperProps) {
  return (
    <div className={styles.monacoWrapper}>
      <Editor
        key={editorKey}
        defaultValue={defaultValue}
        onChange={onChange}
        onMount={onMount}
        options={options}
        theme={theme}
        language={language}
      />
    </div>
  );
}
