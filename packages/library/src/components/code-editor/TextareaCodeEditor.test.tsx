import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TextareaCodeEditor } from "./TextareaCodeEditor";
import type { CodeEditorHandle } from "./types";
import styles from "./textarea-code-editor.module.css";

afterEach(cleanup);

type Props = Parameters<typeof TextareaCodeEditor>[0];

const setup = (props: Partial<Props> = {}) => {
  const onChange = vi.fn();
  const handleRef: { current: CodeEditorHandle | null } = { current: null };

  const utils = render(
    <TextareaCodeEditor
      defaultValue='<p>hi</p>'
      language='html'
      theme='vs-dark'
      onChange={onChange}
      onReady={(handle) => {
        handleRef.current = handle;
      }}
      {...props}
    />,
  );

  return {
    ...utils,
    onChange,
    handleRef,
    textarea: screen.getByRole("textbox") as HTMLTextAreaElement,
  };
};

describe("TextareaCodeEditor", () => {
  it("renders the initial value in an accessible textarea", () => {
    const { textarea } = setup();
    expect(textarea).toHaveValue("<p>hi</p>");
    expect(textarea).toHaveAccessibleName("HTML code");
  });

  it("uses the provided aria label", () => {
    setup({ ariaLabel: "Markup" });
    expect(screen.getByRole("textbox")).toHaveAccessibleName("Markup");
  });

  it("reports edits through onChange", () => {
    const { textarea, onChange } = setup();
    fireEvent.change(textarea, { target: { value: "<b>x</b>" } });
    expect(onChange).toHaveBeenCalledWith("<b>x</b>");
  });

  it("renders one gutter entry per line", () => {
    const { container } = setup({ defaultValue: "a\nb\nc" });
    expect(container.querySelectorAll(`.${styles.lineNumber}`)).toHaveLength(3);
  });

  it("grows the gutter as lines are added", () => {
    const { container, textarea } = setup({ defaultValue: "a" });
    fireEvent.change(textarea, { target: { value: "a\nb" } });
    expect(container.querySelectorAll(`.${styles.lineNumber}`)).toHaveLength(2);
  });

  it("omits the gutter when line numbers are disabled", () => {
    const { container } = setup({
      defaultValue: "a\nb",
      options: { lineNumbers: "off" },
    });
    expect(container.querySelectorAll(`.${styles.lineNumber}`)).toHaveLength(0);
  });

  it("drops the gutter on documents too large to decorate per line", () => {
    const { container } = setup({
      defaultValue: Array.from({ length: 2001 }, (_, i) => `line ${i}`).join(
        "\n",
      ),
    });
    expect(container.querySelectorAll(`.${styles.lineNumber}`)).toHaveLength(0);
  });

  it("indents with Tab instead of moving focus", () => {
    const { textarea, onChange } = setup({ defaultValue: "x" });
    textarea.setSelectionRange(0, 0);

    fireEvent.keyDown(textarea, { key: "Tab" });

    expect(onChange).toHaveBeenCalledWith("  x");
    expect(textarea.value).toBe("  x");
  });

  it("honours the configured tab size", () => {
    const { textarea, onChange } = setup({
      defaultValue: "x",
      options: { tabSize: 4 },
    });
    textarea.setSelectionRange(0, 0);

    fireEvent.keyDown(textarea, { key: "Tab" });

    expect(onChange).toHaveBeenCalledWith("    x");
  });

  it("indents every line of a multi-line selection", () => {
    const { textarea, onChange } = setup({ defaultValue: "a\nb" });
    textarea.setSelectionRange(0, 3);

    fireEvent.keyDown(textarea, { key: "Tab" });

    expect(onChange).toHaveBeenCalledWith("  a\n  b");
  });

  it("outdents a multi-line selection with Shift+Tab", () => {
    const { textarea, onChange } = setup({ defaultValue: "    a\n    b" });
    textarea.setSelectionRange(0, 11);

    fireEvent.keyDown(textarea, { key: "Tab", shiftKey: true });

    expect(onChange).toHaveBeenCalledWith("  a\n  b");
  });

  it("keeps the current indentation on Enter", () => {
    const { textarea, onChange } = setup({ defaultValue: "  a" });
    textarea.setSelectionRange(3, 3);

    fireEvent.keyDown(textarea, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith("  a\n  ");
  });

  it("leaves unindented lines to the browser on Enter", () => {
    const { textarea, onChange } = setup({ defaultValue: "a" });
    textarea.setSelectionRange(1, 1);

    fireEvent.keyDown(textarea, { key: "Enter" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("ignores editing keys when read only", () => {
    const { textarea, onChange } = setup({
      defaultValue: "a",
      options: { readOnly: true },
    });
    textarea.setSelectionRange(0, 0);

    fireEvent.keyDown(textarea, { key: "Tab" });

    expect(onChange).not.toHaveBeenCalled();
    expect(textarea).toHaveAttribute("readonly");
  });

  it("exposes a handle that focuses and reports no formatting support", () => {
    const { handleRef, textarea } = setup();

    expect(handleRef.current).not.toBeNull();
    expect(handleRef.current?.format()).toBe(false);

    handleRef.current?.focus();
    expect(textarea).toHaveFocus();
  });

  it("exposes scroll accessors and scroll subscriptions", () => {
    const { handleRef, container } = setup({ defaultValue: "a\nb\nc" });
    const scroller = container.querySelector(
      `.${styles.scroll}`,
    ) as HTMLDivElement;

    const listener = vi.fn();
    const unsubscribe = handleRef.current!.onScroll(listener);

    fireEvent.scroll(scroller);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    fireEvent.scroll(scroller);
    expect(listener).toHaveBeenCalledTimes(1);

    handleRef.current!.setScrollTop(40);
    expect(handleRef.current!.getScrollTop()).toBe(40);
    // jsdom has no layout, so every element measures zero.
    expect(handleRef.current!.getMaxScroll()).toBe(0);
  });

  it("releases the handle on unmount", () => {
    const { handleRef, unmount } = setup();
    expect(handleRef.current).not.toBeNull();

    unmount();
    expect(handleRef.current).toBeNull();
  });

  it("switches palette with the theme", () => {
    const { container } = setup({ theme: "vs-light" });
    expect(container.querySelector(`.${styles.editor}`)).toHaveAttribute(
      "data-theme",
      "light",
    );
  });

  it("cannot format, and advertises it to toolbars", () => {
    expect(TextareaCodeEditor.canFormat).toBe(false);
  });
});
