import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Wysiwyg,
  WysiwygToolbar,
  WysiwygBold,
  WysiwygItalic,
  WysiwygHeading,
  WysiwygFontSize,
  WysiwygControl,
  WysiwygContent,
} from "./index";

// jsdom implements neither execCommand nor the query* helpers, so we stub them.
let execCommand: ReturnType<typeof vi.fn>;
let queryCommandState: ReturnType<typeof vi.fn>;
let queryCommandValue: ReturnType<typeof vi.fn>;

beforeEach(() => {
  execCommand = vi.fn().mockReturnValue(true);
  queryCommandState = vi.fn().mockReturnValue(false);
  queryCommandValue = vi.fn().mockReturnValue("");
  document.execCommand = execCommand as unknown as typeof document.execCommand;
  document.queryCommandState =
    queryCommandState as unknown as typeof document.queryCommandState;
  document.queryCommandValue =
    queryCommandValue as unknown as typeof document.queryCommandValue;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Wysiwyg", () => {
  it("throws when a compound part is used outside of <Wysiwyg>", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<WysiwygBold />)).toThrow(
      /must be used within <Wysiwyg>/,
    );
    spy.mockRestore();
  });

  it("renders the composed toolbar and editable surface", () => {
    render(
      <Wysiwyg defaultValue='<p>Hi</p>'>
        <WysiwygToolbar>
          <WysiwygBold />
          <WysiwygItalic />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("contenteditable");
    expect(screen.getByRole("button", { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /italic/i })).toBeInTheDocument();
  });

  it("renders the initial value into the editable surface on mount", () => {
    render(
      <Wysiwyg value='<p>Existing content</p>'>
        <WysiwygContent />
      </Wysiwyg>,
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toContainHTML("<p>Existing content</p>");
  });

  it("renders the initial defaultValue when uncontrolled", () => {
    render(
      <Wysiwyg defaultValue='<h1>Title</h1>'>
        <WysiwygContent />
      </Wysiwyg>,
    );

    expect(screen.getByRole("textbox")).toContainHTML("<h1>Title</h1>");
  });

  it("runs the matching execCommand when a control is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Wysiwyg>
        <WysiwygToolbar>
          <WysiwygBold />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    await user.click(screen.getByRole("button", { name: /bold/i }));
    expect(execCommand).toHaveBeenCalledWith("bold", false, undefined);
  });

  it("emits the passed block tag for headings", async () => {
    const user = userEvent.setup();
    render(
      <Wysiwyg>
        <WysiwygToolbar>
          <WysiwygHeading level={2} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    await user.click(screen.getByRole("button", { name: /heading 2/i }));
    expect(execCommand).toHaveBeenCalledWith("formatBlock", false, "<h2>");
  });

  it("reflects active state from queryCommandState via aria-pressed", () => {
    queryCommandState.mockImplementation((cmd: string) => cmd === "bold");
    render(
      <Wysiwyg>
        <WysiwygToolbar>
          <WysiwygBold />
          <WysiwygItalic />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    expect(screen.getByRole("button", { name: /bold/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /italic/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("applies font size as CSS through execCommand", async () => {
    const user = userEvent.setup();
    render(
      <Wysiwyg>
        <WysiwygToolbar>
          <WysiwygFontSize />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    await user.selectOptions(screen.getByRole("combobox"), "5");
    expect(execCommand).toHaveBeenCalledWith("styleWithCSS", false, "true");
    expect(execCommand).toHaveBeenCalledWith("fontSize", false, "5");
  });

  it("supports custom controls via WysiwygControl", async () => {
    const user = userEvent.setup();
    render(
      <Wysiwyg>
        <WysiwygToolbar>
          <WysiwygControl command='underline' title='Custom underline'>
            Custom
          </WysiwygControl>
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    await user.click(screen.getByRole("button", { name: /custom underline/i }));
    expect(execCommand).toHaveBeenCalledWith("underline", false, undefined);
  });

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Wysiwyg onChange={onChange}>
        <WysiwygContent />
      </Wysiwyg>,
    );

    const editor = screen.getByRole("textbox");
    await user.click(editor);
    await user.type(editor, "Hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("disables controls and marks the surface read-only when disabled", () => {
    render(
      <Wysiwyg disabled>
        <WysiwygToolbar>
          <WysiwygBold />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    expect(screen.getByRole("button", { name: /bold/i })).toBeDisabled();
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "contenteditable",
      "false",
    );
  });
});
