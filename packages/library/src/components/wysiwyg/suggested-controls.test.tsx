import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygEmoji } from "./WysiwygEmoji";
import { WysiwygSpecialChar } from "./WysiwygSpecialChar";
import { WysiwygClearColor } from "./WysiwygClearColor";
import { WysiwygLinkEditor } from "./WysiwygLinkEditor";
import { WysiwygFullscreen } from "./WysiwygFullscreen";

const originalExec = document.execCommand;

beforeEach(() => {
  document.execCommand = vi.fn(() => true) as typeof document.execCommand;
});
afterEach(() => {
  cleanup();
  document.execCommand = originalExec;
  vi.restoreAllMocks();
});

describe("WysiwygEmoji / WysiwygSpecialChar", () => {
  it("inserts an emoji via insertText", () => {
    render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygEmoji emojis={["🎉"]} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /emoji/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /insert 🎉/i }));
    expect(document.execCommand).toHaveBeenCalledWith("insertText", false, "🎉");
  });

  it("inserts a special character via insertText", () => {
    render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygSpecialChar characters={["©"]} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /special character/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /insert ©/i }));
    expect(document.execCommand).toHaveBeenCalledWith("insertText", false, "©");
  });
});

describe("WysiwygClearColor", () => {
  it("resets the text color to inherit", () => {
    render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygClearColor />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /clear text color/i }));
    expect(document.execCommand).toHaveBeenCalledWith("foreColor", false, "inherit");
  });
});

describe("WysiwygLinkEditor", () => {
  const renderWithLink = (onChange = vi.fn(), getUrl?: () => string | null) => {
    const utils = render(
      <Wysiwyg defaultValue='<p><a href="https://a.test">link</a></p>' onChange={onChange}>
        <WysiwygContent />
        <WysiwygLinkEditor getUrl={getUrl} />
      </Wysiwyg>,
    );
    const a = utils.container.querySelector("a") as HTMLAnchorElement;
    act(() => {
      const range = document.createRange();
      range.selectNodeContents(a);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
      document.dispatchEvent(new Event("selectionchange"));
    });
    return { ...utils, a, onChange };
  };

  it("shows the bar when the caret is inside a link", () => {
    renderWithLink();
    expect(screen.getByRole("toolbar", { name: /edit link/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open link/i })).toHaveAttribute(
      "href",
      "https://a.test",
    );
  });

  it("edits the link URL", () => {
    const { onChange } = renderWithLink(vi.fn(), () => "https://new.test");
    fireEvent.click(screen.getByRole("button", { name: /edit link url/i }));
    const html = onChange.mock.calls.at(-1)?.[0] as string;
    expect(html).toContain('href="https://new.test"');
  });

  it("removes the link (unwraps it)", () => {
    const { onChange } = renderWithLink();
    fireEvent.click(screen.getByRole("button", { name: /remove link/i }));
    const html = onChange.mock.calls.at(-1)?.[0] as string;
    expect(html).not.toContain("<a");
    expect(html).toContain("link");
  });
});

describe("WysiwygFullscreen", () => {
  it("requests fullscreen on the editor root", () => {
    const requestFullscreen = vi.fn();
    // jsdom has no Fullscreen API; stub it.
    (Element.prototype as unknown as { requestFullscreen: () => void }).requestFullscreen =
      requestFullscreen;

    render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygFullscreen />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /toggle fullscreen/i }));
    expect(requestFullscreen).toHaveBeenCalled();
  });
});
