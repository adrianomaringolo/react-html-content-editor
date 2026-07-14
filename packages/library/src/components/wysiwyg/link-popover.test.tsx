import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygLink } from "./WysiwygLink";

const originalExec = document.execCommand;

beforeEach(() => {
  document.execCommand = vi.fn(() => true) as typeof document.execCommand;
});
afterEach(() => {
  cleanup();
  document.execCommand = originalExec;
  vi.restoreAllMocks();
});

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

const openBtn = () =>
  screen.getByRole("button", { name: /insert link/i });

describe("WysiwygLink popover", () => {
  it("opens a URL popover instead of a prompt", () => {
    render(
      <Wysiwyg defaultValue='<p>text</p>'>
        <WysiwygToolbar>
          <WysiwygLink />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(openBtn());
    expect(
      screen.getByRole("dialog", { name: /insert link/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Link URL")).toBeInTheDocument();
  });

  it("wraps a selection with createLink", () => {
    const { container } = render(
      <Wysiwyg defaultValue='<p>text</p>'>
        <WysiwygToolbar>
          <WysiwygLink />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    selectInto(container.querySelector("p") as HTMLElement);
    fireEvent.click(openBtn());
    const input = screen.getByLabelText("Link URL");
    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /apply link/i }));
    expect(document.execCommand).toHaveBeenCalledWith(
      "createLink",
      false,
      "https://example.com",
    );
  });

  it("inserts a linked URL when there is no selection", () => {
    render(
      <Wysiwyg defaultValue='<p>text</p>'>
        <WysiwygToolbar>
          <WysiwygLink />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(openBtn());
    fireEvent.change(screen.getByLabelText("Link URL"), {
      target: { value: "https://example.com" },
    });
    fireEvent.keyDown(screen.getByLabelText("Link URL"), { key: "Enter" });
    expect(document.execCommand).toHaveBeenCalledWith(
      "insertHTML",
      false,
      expect.stringContaining('href="https://example.com"'),
    );
  });

  it("uses the getUrl override without opening the popover", () => {
    render(
      <Wysiwyg defaultValue='<p>text</p>'>
        <WysiwygToolbar>
          <WysiwygLink getUrl={() => "https://override.test"} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(openBtn());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.execCommand).toHaveBeenCalledWith(
      "createLink",
      false,
      "https://override.test",
    );
  });
});
