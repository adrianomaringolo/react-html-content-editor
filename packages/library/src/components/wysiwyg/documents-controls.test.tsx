import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygCaseTransform } from "./WysiwygCaseTransform";
import { WysiwygLineHeight } from "./WysiwygLineHeight";
import { WysiwygLetterSpacing } from "./WysiwygLetterSpacing";
import { WysiwygFindReplace } from "./WysiwygFindReplace";
import { WysiwygTableOfContents } from "./WysiwygTableOfContents";
import { WysiwygCallout } from "./WysiwygCallout";
import { WysiwygPrint } from "./WysiwygPrint";
import { WysiwygExport, htmlToMarkdown } from "./WysiwygExport";

const originalExec = document.execCommand;

beforeEach(() => {
  document.execCommand = vi.fn(() => true) as typeof document.execCommand;
});
afterEach(() => {
  cleanup();
  document.execCommand = originalExec;
  vi.restoreAllMocks();
});

/** Select the contents of `node` and notify the editor. */
function selectInto(node: Node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
  act(() => {
    document.dispatchEvent(new Event("selectionchange"));
  });
}

describe("WysiwygCaseTransform", () => {
  it("uppercases the selected text, preserving markup", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Wysiwyg defaultValue='<p>hello <strong>world</strong></p>' onChange={onChange}>
        <WysiwygToolbar>
          <WysiwygCaseTransform />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const p = container.querySelector("p") as HTMLElement;
    fireEvent.click(screen.getByRole("button", { name: /change case/i }));
    selectInto(p);
    fireEvent.click(screen.getByRole("menuitem", { name: "UPPERCASE" }));
    expect(p.textContent).toBe("HELLO WORLD");
    expect(p.querySelector("strong")?.textContent).toBe("WORLD");
    expect(onChange).toHaveBeenCalled();
  });
});

describe("WysiwygLineHeight", () => {
  it("sets the line height on the selected block", () => {
    const { container } = render(
      <Wysiwyg defaultValue='<p>line</p>'>
        <WysiwygToolbar>
          <WysiwygLineHeight />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const p = container.querySelector("p") as HTMLElement;
    fireEvent.click(screen.getByRole("button", { name: /line height/i }));
    selectInto(p);
    fireEvent.click(screen.getByRole("menuitem", { name: "1.5" }));
    expect(p.style.lineHeight).toBe("1.5");
  });
});

describe("WysiwygLetterSpacing", () => {
  it("wraps the selection in a letter-spacing span", () => {
    const { container } = render(
      <Wysiwyg defaultValue='<p>spaced</p>'>
        <WysiwygToolbar>
          <WysiwygLetterSpacing />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const p = container.querySelector("p") as HTMLElement;
    fireEvent.click(screen.getByRole("button", { name: /letter spacing/i }));
    selectInto(p);
    fireEvent.click(screen.getByRole("menuitem", { name: "Wider" }));
    expect(document.execCommand).toHaveBeenCalledWith(
      "insertHTML",
      false,
      expect.stringContaining("letter-spacing: 1px"),
    );
  });
});

describe("WysiwygCallout", () => {
  it("inserts a callout of the chosen variant", () => {
    render(
      <Wysiwyg defaultValue='<p>hi</p>'>
        <WysiwygToolbar>
          <WysiwygCallout />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /^callout$/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Warning" }));
    expect(document.execCommand).toHaveBeenCalledWith(
      "insertHTML",
      false,
      expect.stringContaining('data-wysiwyg-callout="warning"'),
    );
  });
});

describe("WysiwygTableOfContents", () => {
  it("assigns heading ids and inserts a TOC", () => {
    const { container } = render(
      <Wysiwyg defaultValue='<h1>Intro</h1><h2>Details</h2><p>body</p>'>
        <WysiwygToolbar>
          <WysiwygTableOfContents />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /table of contents/i }));
    expect(container.querySelector("h1")?.id).toBe("intro");
    expect(container.querySelector("h2")?.id).toBe("details");
    expect(document.execCommand).toHaveBeenCalledWith(
      "insertHTML",
      false,
      expect.stringContaining('data-wysiwyg-toc="true"'),
    );
    const html = (document.execCommand as ReturnType<typeof vi.fn>).mock
      .calls[0][2] as string;
    expect(html).toContain('href="#intro"');
    expect(html).toContain('href="#details"');
  });

  it("does nothing when there are no headings", () => {
    render(
      <Wysiwyg defaultValue='<p>no headings here</p>'>
        <WysiwygToolbar>
          <WysiwygTableOfContents />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /table of contents/i }));
    expect(document.execCommand).not.toHaveBeenCalled();
  });
});

describe("WysiwygFindReplace", () => {
  const open = () =>
    fireEvent.click(screen.getByRole("button", { name: /find and replace/i }));

  it("counts matches as you type", () => {
    render(
      <Wysiwyg defaultValue='<p>foo bar foo</p>'>
        <WysiwygToolbar>
          <WysiwygFindReplace />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    open();
    fireEvent.change(screen.getByLabelText("Find"), {
      target: { value: "foo" },
    });
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });

  it("replaces all occurrences", () => {
    const { container } = render(
      <Wysiwyg defaultValue='<p>foo bar foo</p>'>
        <WysiwygToolbar>
          <WysiwygFindReplace />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    open();
    fireEvent.change(screen.getByLabelText("Find"), {
      target: { value: "foo" },
    });
    fireEvent.change(screen.getByLabelText("Replace with"), {
      target: { value: "baz" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^replace all$/i }));
    expect(container.querySelector("p")?.textContent).toBe("baz bar baz");
  });
});

describe("WysiwygPrint", () => {
  it("opens a print window with the content", () => {
    const printWin = {
      document: { write: vi.fn(), close: vi.fn() },
      focus: vi.fn(),
      print: vi.fn(),
    };
    const openSpy = vi
      .spyOn(window, "open")
      .mockReturnValue(printWin as unknown as Window);

    render(
      <Wysiwyg defaultValue='<p>print me</p>'>
        <WysiwygToolbar>
          <WysiwygPrint documentTitle='My doc' />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /print/i }));
    expect(openSpy).toHaveBeenCalled();
    expect(printWin.document.write).toHaveBeenCalledWith(
      expect.stringContaining("print me"),
    );
    expect(printWin.print).toHaveBeenCalled();
  });
});

describe("WysiwygExport", () => {
  const urlAny = URL as unknown as Record<string, unknown>;
  const originalCreate = urlAny.createObjectURL;
  const originalRevoke = urlAny.revokeObjectURL;
  afterEach(() => {
    urlAny.createObjectURL = originalCreate;
    urlAny.revokeObjectURL = originalRevoke;
  });

  it("downloads the content as a file", () => {
    const createUrl = vi.fn(() => "blob:x");
    // jsdom may not implement these.
    urlAny.createObjectURL = createUrl;
    urlAny.revokeObjectURL = vi.fn();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    render(
      <Wysiwyg defaultValue='<h1>Title</h1>'>
        <WysiwygToolbar>
          <WysiwygExport />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /^export$/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /export as html/i }));
    expect(createUrl).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });
});

describe("htmlToMarkdown", () => {
  it("converts common elements", () => {
    const md = htmlToMarkdown(
      '<h1>Title</h1><p>Hello <strong>bold</strong> and <em>italic</em> and <a href="https://x.com">link</a>.</p><ul><li>one</li><li>two</li></ul>',
    );
    expect(md).toContain("# Title");
    expect(md).toContain("**bold**");
    expect(md).toContain("*italic*");
    expect(md).toContain("[link](https://x.com)");
    expect(md).toContain("- one");
    expect(md).toContain("- two");
  });

  it("numbers ordered lists", () => {
    const md = htmlToMarkdown("<ol><li>first</li><li>second</li></ol>");
    expect(md).toContain("1. first");
    expect(md).toContain("2. second");
  });
});
