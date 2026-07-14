import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygFontSizeInput } from "./WysiwygFontSizeInput";

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

describe("WysiwygFontSizeInput", () => {
  it("renders a pixel input with − and + steppers", () => {
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
    expect(
      screen.getByRole("button", { name: /decrease font size/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /increase font size/i }),
    ).toBeInTheDocument();
  });

  it("wraps the selection in a sized span as you type", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Wysiwyg defaultValue='<p>big</p>' onChange={onChange}>
        <WysiwygToolbar>
          <WysiwygFontSizeInput />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const p = container.querySelector("p") as HTMLElement;
    selectInto(p);
    fireEvent.change(screen.getByRole("spinbutton", { name: /font size/i }), {
      target: { value: "24" },
    });
    const span = p.querySelector("span");
    expect(span?.style.fontSize).toBe("24px");
    expect(span?.textContent).toBe("big");
    expect(onChange).toHaveBeenCalled();
  });

  it("resizes an existing sized span in place (no nesting)", () => {
    render(
      <Wysiwyg defaultValue='<p><span style="font-size: 20px">word</span></p>'>
        <WysiwygToolbar>
          <WysiwygFontSizeInput />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const editor = screen.getByRole("textbox");
    selectInto(editor.querySelector("span") as HTMLElement);
    fireEvent.change(screen.getByRole("spinbutton", { name: /font size/i }), {
      target: { value: "30" },
    });
    expect(editor.querySelectorAll("span")).toHaveLength(1);
    expect(editor.querySelector("span")?.style.fontSize).toBe("30px");
  });

  it("steps the size with the + button", () => {
    render(
      <Wysiwyg defaultValue='<p>hi</p>'>
        <WysiwygToolbar>
          <WysiwygFontSizeInput />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const editor = screen.getByRole("textbox");
    selectInto(editor.querySelector("p") as HTMLElement);
    fireEvent.click(screen.getByRole("button", { name: /increase font size/i }));
    // No size was set, so the field defaults to 16 and steps to 17.
    expect(editor.querySelector("span")?.style.fontSize).toBe("17px");
  });

  it("ignores out-of-range values", () => {
    const onChange = vi.fn();
    render(
      <Wysiwyg defaultValue='<p>x</p>' onChange={onChange}>
        <WysiwygToolbar>
          <WysiwygFontSizeInput min={8} max={96} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const editor = screen.getByRole("textbox");
    selectInto(editor.querySelector("p") as HTMLElement);
    fireEvent.change(screen.getByRole("spinbutton", { name: /font size/i }), {
      target: { value: "500" },
    });
    expect(editor.querySelector("span")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
});
