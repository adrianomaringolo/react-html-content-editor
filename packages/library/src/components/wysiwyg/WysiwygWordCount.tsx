import React from "react";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";

/** A read-only word/character counter for the editor content. */
export interface WysiwygWordCountProps {
  className?: string;
  /** Render a custom label from the counts (default: "N words · M chars"). */
  render?: (counts: { words: number; characters: number }) => React.ReactNode;
}

const stripHtml = (html: string): string => {
  if (typeof document !== "undefined") {
    const el = document.createElement("div");
    el.innerHTML = html;
    return el.textContent ?? "";
  }
  return html.replace(/<[^>]*>/g, " ");
};

export const WysiwygWordCount: React.FC<WysiwygWordCountProps> = ({
  className = "",
  render,
}) => {
  const { value } = useWysiwygContext();
  const text = stripHtml(value).trim();
  const words = text ? text.split(/\s+/).length : 0;
  const characters = text.length;

  return (
    <span className={`${styles.wordCount} ${className}`.trim()} aria-live='polite'>
      {render ? (
        render({ words, characters })
      ) : (
        <>
          {words} {words === 1 ? "word" : "words"} · {characters}{" "}
          {characters === 1 ? "char" : "chars"}
        </>
      )}
    </span>
  );
};
