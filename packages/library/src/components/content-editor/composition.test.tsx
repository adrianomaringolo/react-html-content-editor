import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ContentEditor } from "../ContentEditor";
import { ContentEditorToolbar } from "./ContentEditorToolbar";
import { ContentEditorBody } from "./ContentEditorBody";
import { ContentEditorCode } from "./ContentEditorCode";
import { ContentEditorPreview } from "./ContentEditorPreview";
import { ContentEditorWysiwyg } from "./ContentEditorWysiwyg";

function Harness({
  initial = { html: "<p>Hello</p>", css: "p { color: red; }" },
}: {
  initial?: { html: string; css: string };
}) {
  const [value, setValue] = useState(initial);
  return (
    <ContentEditor value={value} onChange={setValue}>
      <ContentEditorToolbar />
      <ContentEditorBody>
        <ContentEditorCode />
        <ContentEditorPreview />
        <ContentEditorWysiwyg />
      </ContentEditorBody>
    </ContentEditor>
  );
}

describe("ContentEditor composition", () => {
  it("renders the Code/Visual mode switch when a WYSIWYG pane is present", () => {
    render(<Harness />);
    expect(
      screen.getByRole("button", { name: /code view/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /visual editor/i }),
    ).toBeInTheDocument();
  });

  it("switches to the WYSIWYG surface and reflects the shared HTML value", () => {
    render(<Harness />);

    // Code mode initially: no rich-text surface yet.
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /visual editor/i }));

    const surface = screen.getByRole("textbox", { name: /rich text editor/i });
    expect(surface).toBeInTheDocument();
    expect(surface.innerHTML).toContain("Hello");
  });

  it("applies the CSS value as a <style> tag inside the WYSIWYG pane", () => {
    const { container } = render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /visual editor/i }));

    const style = container.querySelector("style");
    expect(style?.textContent).toContain("color: red");
  });

  it("keeps the toggle-driven view toggles hidden in WYSIWYG mode", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /visual editor/i }));

    // The code-only view toggles (Toggle edit/preview) are gone.
    expect(
      screen.queryByRole("button", { name: /toggle preview mode/i }),
    ).not.toBeInTheDocument();

    // Switching back restores them.
    fireEvent.click(screen.getByRole("button", { name: /code view/i }));
    expect(
      screen.getByRole("button", { name: /toggle preview mode/i }),
    ).toBeInTheDocument();
  });

  it("propagates rich-text edits back through onChange", () => {
    render(<Harness initial={{ html: "<p>start</p>", css: "" }} />);
    fireEvent.click(screen.getByRole("button", { name: /visual editor/i }));

    const surface = screen.getByRole("textbox", { name: /rich text editor/i });
    surface.innerHTML = "<p>edited</p>";
    fireEvent.input(surface);

    // Back to code mode; the preview should carry the edited HTML.
    fireEvent.click(screen.getByRole("button", { name: /code view/i }));
    fireEvent.click(screen.getByRole("button", { name: /toggle preview mode/i }));
    expect(within(document.body).getByText("edited")).toBeInTheDocument();
  });

  it("does not render the mode switch without a WYSIWYG pane", () => {
    function CodeOnly() {
      const [value, setValue] = useState({ html: "<p>x</p>", css: "" });
      return (
        <ContentEditor value={value} onChange={setValue}>
          <ContentEditorToolbar />
          <ContentEditorBody>
            <ContentEditorCode />
            <ContentEditorPreview />
          </ContentEditorBody>
        </ContentEditor>
      );
    }
    render(<CodeOnly />);
    expect(
      screen.queryByRole("button", { name: /visual editor/i }),
    ).not.toBeInTheDocument();
  });
});
