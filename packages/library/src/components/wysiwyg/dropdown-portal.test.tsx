import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygTextColor } from "./WysiwygTextColor";
import { WysiwygFindReplace } from "./WysiwygFindReplace";

beforeEach(() => {
  document.execCommand = vi.fn(() => true) as typeof document.execCommand;
});
afterEach(() => cleanup());

/**
 * The editor container hides overflow (for rounded corners), so toolbar
 * popovers must render in a body portal or they get clipped near an edge.
 */
describe("toolbar popovers escape the editor container", () => {
  it("renders a dropdown popover in the document body, not inside the editor", () => {
    render(
      <Wysiwyg defaultValue='<p>hi</p>'>
        <WysiwygToolbar>
          <WysiwygTextColor colors={["#ff0000"]} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const editorRoot = screen.getByRole("toolbar").parentElement as HTMLElement;
    fireEvent.click(screen.getByRole("button", { name: /text color/i }));

    const menu = screen.getByRole("menu");
    expect(document.body.contains(menu)).toBe(true);
    expect(editorRoot.contains(menu)).toBe(false);
  });

  it("renders the find & replace panel in the document body", () => {
    render(
      <Wysiwyg defaultValue='<p>hi</p>'>
        <WysiwygToolbar>
          <WysiwygFindReplace />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const editorRoot = screen.getByRole("toolbar").parentElement as HTMLElement;
    fireEvent.click(screen.getByRole("button", { name: /find and replace/i }));

    const panel = screen.getByRole("dialog", { name: /find and replace/i });
    expect(document.body.contains(panel)).toBe(true);
    expect(editorRoot.contains(panel)).toBe(false);
  });
});
