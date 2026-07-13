import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygSubscript } from "./WysiwygSubscript";
import { WysiwygSuperscript } from "./WysiwygSuperscript";
import { WysiwygIndent } from "./WysiwygIndent";
import { WysiwygOutdent } from "./WysiwygOutdent";
import { WysiwygHorizontalRule } from "./WysiwygHorizontalRule";
import { WysiwygCodeBlock } from "./WysiwygCodeBlock";
import { WysiwygTextColor } from "./WysiwygTextColor";
import { WysiwygHighlight } from "./WysiwygHighlight";
import { WysiwygFontFamily } from "./WysiwygFontFamily";
import { WysiwygHeadingMenu } from "./WysiwygHeadingMenu";
import { WysiwygWordCount } from "./WysiwygWordCount";
import { WysiwygInlineCode } from "./WysiwygInlineCode";

const originalExec = document.execCommand;
const originalQueryValue = document.queryCommandValue;

beforeEach(() => {
  document.execCommand = vi.fn(() => true) as typeof document.execCommand;
});
afterEach(() => {
  cleanup();
  document.execCommand = originalExec;
  document.queryCommandValue = originalQueryValue;
  vi.restoreAllMocks();
});

const wrap = (ui: React.ReactNode) =>
  render(
    <Wysiwyg defaultValue='<p>hello world</p>'>
      <WysiwygToolbar>{ui}</WysiwygToolbar>
      <WysiwygContent />
    </Wysiwyg>,
  );

describe("simple execCommand controls", () => {
  it.each([
    [<WysiwygSubscript key='s' />, /subscript/i, "subscript"],
    [<WysiwygSuperscript key='s' />, /superscript/i, "superscript"],
    [<WysiwygIndent key='s' />, /increase indent/i, "indent"],
    [<WysiwygOutdent key='s' />, /decrease indent/i, "outdent"],
    [<WysiwygHorizontalRule key='s' />, /horizontal rule/i, "insertHorizontalRule"],
  ])("runs its command", (ui, name, command) => {
    wrap(ui);
    fireEvent.click(screen.getByRole("button", { name }));
    expect(document.execCommand).toHaveBeenCalledWith(command, false, undefined);
  });

  it("formats a code block via formatBlock", () => {
    wrap(<WysiwygCodeBlock />);
    fireEvent.click(screen.getByRole("button", { name: /code block/i }));
    expect(document.execCommand).toHaveBeenCalledWith(
      "formatBlock",
      false,
      "<pre>",
    );
  });
});

describe("color dropdowns", () => {
  it("applies a text color from the swatch picker", () => {
    wrap(<WysiwygTextColor colors={["#ff0000"]} />);
    fireEvent.click(screen.getByRole("button", { name: /text color/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /text color #ff0000/i }));
    expect(document.execCommand).toHaveBeenCalledWith("foreColor", false, "#ff0000");
  });

  it("applies a highlight color", () => {
    wrap(<WysiwygHighlight colors={["#fff000"]} />);
    fireEvent.click(screen.getByRole("button", { name: /^highlight$/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /highlight #fff000/i }));
    expect(document.execCommand).toHaveBeenCalledWith("hiliteColor", false, "#fff000");
  });
});

describe("WysiwygFontFamily", () => {
  it("sets the font family via fontName", () => {
    wrap(
      <WysiwygFontFamily options={[{ label: "Mono", value: "monospace" }]} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /font family/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /mono/i }));
    expect(document.execCommand).toHaveBeenCalledWith("fontName", false, "monospace");
  });
});

describe("WysiwygHeadingMenu", () => {
  it("opens and offers all heading levels + paragraph", () => {
    wrap(<WysiwygHeadingMenu />);
    fireEvent.click(screen.getByRole("button", { name: /heading/i }));
    const menu = screen.getByRole("menu", { name: /heading/i });
    // H1..H6 render as toolbar buttons inside the popover
    expect(within(menu).getByRole("button", { name: /heading 1/i })).toBeInTheDocument();
    expect(within(menu).getByRole("button", { name: /heading 6/i })).toBeInTheDocument();
    expect(within(menu).getByRole("button", { name: /paragraph/i })).toBeInTheDocument();
  });

  it("reflects the current block in data-block", () => {
    document.queryCommandValue = vi.fn(
      (cmd: string) => (cmd === "formatBlock" ? "h3" : ""),
    ) as typeof document.queryCommandValue;
    wrap(<WysiwygHeadingMenu />);
    expect(screen.getByRole("button", { name: /heading \(h3\)/i })).toHaveAttribute(
      "data-block",
      "h3",
    );
  });
});

describe("WysiwygInlineCode", () => {
  it("wraps the selection in <code>", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Wysiwyg defaultValue='<p>hello</p>' onChange={onChange}>
        <WysiwygToolbar>
          <WysiwygInlineCode />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    // Select the text node inside the paragraph.
    const p = container.querySelector("p")!;
    const range = document.createRange();
    range.selectNodeContents(p);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    fireEvent.click(screen.getByRole("button", { name: /inline code/i }));

    const html = (onChange.mock.calls.at(-1)?.[0] as string) ?? container.innerHTML;
    expect(html).toContain("<code>");
  });
});

describe("WysiwygWordCount", () => {
  it("counts words and characters", () => {
    render(
      <Wysiwyg defaultValue='<p>one two three</p>'>
        <WysiwygToolbar>
          <WysiwygWordCount />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    expect(screen.getByText(/3 words/i)).toBeInTheDocument();
  });
});
