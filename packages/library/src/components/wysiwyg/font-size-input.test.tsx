import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygFontSizeInput } from "./WysiwygFontSizeInput";

const originalExec = document.execCommand;

beforeEach(() => {
  // jsdom has no execCommand; a no-op mock lets us assert wiring and exercise
  // the <font size="7"> → px rewrite against pre-seeded markup.
  document.execCommand = vi.fn(() => true) as typeof document.execCommand;
});
afterEach(() => {
  cleanup();
  document.execCommand = originalExec;
  vi.restoreAllMocks();
});

describe("WysiwygFontSizeInput", () => {
  it("renders a pixel input", () => {
    render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygFontSizeInput />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    expect(
      screen.getByRole("spinbutton", { name: /font size/i }),
    ).toBeInTheDocument();
  });

  it("marks the selection with fontSize=7 (styleWithCSS off) then rewrites to px", () => {
    const onChange = vi.fn();
    render(
      <Wysiwyg
        defaultValue='<p><font size="7">big</font></p>'
        onChange={onChange}
      >
        <WysiwygToolbar>
          <WysiwygFontSizeInput />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    const input = screen.getByRole("spinbutton", { name: /font size/i });
    fireEvent.change(input, { target: { value: "24" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // wiring: legacy marker applied with styleWithCSS disabled
    expect(document.execCommand).toHaveBeenCalledWith("styleWithCSS", false, "false");
    expect(document.execCommand).toHaveBeenCalledWith("fontSize", false, "7");

    // rewrite: the <font size="7"> becomes a span with the px size
    const html = onChange.mock.calls.at(-1)?.[0] as string;
    expect(html).toContain("font-size: 24px");
    expect(html).not.toContain("<font");
  });

  it("ignores out-of-range values", () => {
    const onChange = vi.fn();
    render(
      <Wysiwyg defaultValue='<p><font size="7">x</font></p>' onChange={onChange}>
        <WysiwygToolbar>
          <WysiwygFontSizeInput min={8} max={96} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const input = screen.getByRole("spinbutton", { name: /font size/i });
    fireEvent.change(input, { target: { value: "500" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(document.execCommand).not.toHaveBeenCalledWith("fontSize", false, "7");
  });
});
