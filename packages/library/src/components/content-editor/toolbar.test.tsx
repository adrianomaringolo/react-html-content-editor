import { useState } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { ContentEditor } from "../ContentEditor";
import { FormattingCodeEditor } from "../../test/codeEditors";
import type { CodeEditorComponent } from "../code-editor/types";
import { ContentEditorToolbar } from "./ContentEditorToolbar";
import { ContentEditorBody } from "./ContentEditorBody";
import { ContentEditorCode } from "./ContentEditorCode";
import { ContentEditorPreview } from "./ContentEditorPreview";
import { ContentEditorWysiwyg } from "./ContentEditorWysiwyg";

afterEach(cleanup);

function Composed({
  onSave,
  withWysiwyg = true,
  toolbarClassName,
  toolbarChildren,
  defaultTab,
  defaultMode,
  error,
  codeEditor,
}: {
  onSave?: () => Promise<void>;
  withWysiwyg?: boolean;
  toolbarClassName?: string;
  toolbarChildren?: React.ReactNode;
  defaultTab?: "html" | "css";
  defaultMode?: "code" | "wysiwyg";
  error?: string;
  codeEditor?: CodeEditorComponent;
}) {
  const [value, setValue] = useState({
    html: "<p>Hi</p>",
    css: "p { color: red; }",
  });
  return (
    <ContentEditor
      value={value}
      onChange={setValue}
      onSave={onSave}
      defaultTab={defaultTab}
      defaultMode={defaultMode}
      error={error}
      codeEditor={codeEditor}
    >
      <ContentEditorToolbar className={toolbarClassName}>
        {toolbarChildren}
      </ContentEditorToolbar>
      <ContentEditorBody>
        <ContentEditorCode />
        <ContentEditorPreview />
        {withWysiwyg && <ContentEditorWysiwyg />}
      </ContentEditorBody>
    </ContentEditor>
  );
}

describe("ContentEditorToolbar", () => {
  it("passes className through to the toolbar container", () => {
    const { container } = render(<Composed toolbarClassName='my-toolbar' />);
    expect(container.querySelector(".my-toolbar")).toBeInTheDocument();
  });

  it("shows the HTML/CSS selector buttons with aria-pressed state", () => {
    render(<Composed />);
    const html = screen.getByRole("button", { name: /html editor/i });
    const css = screen.getByRole("button", { name: /css editor/i });
    expect(html).toHaveAttribute("aria-pressed", "true");
    expect(css).toHaveAttribute("aria-pressed", "false");
  });

  it("honours defaultTab by pre-selecting the CSS editor", () => {
    render(<Composed defaultTab='css' />);
    expect(
      screen.getByRole("button", { name: /css editor/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles preview into a split view (both toggles pressed)", () => {
    render(<Composed />);
    const edit = screen.getByRole("button", { name: /toggle edit mode/i });
    const preview = screen.getByRole("button", {
      name: /toggle preview mode/i,
    });
    expect(edit).toHaveAttribute("aria-pressed", "true");
    expect(preview).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(preview);
    expect(edit).toHaveAttribute("aria-pressed", "true");
    expect(preview).toHaveAttribute("aria-pressed", "true");
  });

  it("toggling edit off from the edit-only state reveals preview only", () => {
    render(<Composed />);
    const edit = screen.getByRole("button", { name: /toggle edit mode/i });
    fireEvent.click(edit);
    expect(edit).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: /toggle preview mode/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("hides the format action when the code editor cannot format", () => {
    render(<Composed />);
    expect(
      screen.queryByRole("button", { name: /format html/i }),
    ).not.toBeInTheDocument();
  });

  it("swaps the format button label with the active editor", () => {
    render(<Composed codeEditor={FormattingCodeEditor} />);
    expect(
      screen.getByRole("button", { name: /format html/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /css editor/i }));
    expect(
      screen.getByRole("button", { name: /format css/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /format html/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the save button and status only when onSave is provided", () => {
    const { rerender } = render(<Composed />);
    expect(
      screen.queryByRole("button", { name: /save content/i }),
    ).not.toBeInTheDocument();

    rerender(<Composed onSave={vi.fn().mockResolvedValue(undefined)} />);
    expect(
      screen.getByRole("button", { name: /save content/i }),
    ).toBeInTheDocument();
  });

  it("replaces the left group with custom children and hides the built-in actions", () => {
    render(
      <Composed
        onSave={vi.fn().mockResolvedValue(undefined)}
        toolbarChildren={<button>custom</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "custom" }),
    ).toBeInTheDocument();
    // Built-in switch and actions are gone.
    expect(
      screen.queryByRole("button", { name: /code view/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save content/i }),
    ).not.toBeInTheDocument();
  });

  it("hides the format button while in WYSIWYG mode", () => {
    render(<Composed />);
    fireEvent.click(screen.getByRole("button", { name: /visual editor/i }));
    expect(
      screen.queryByRole("button", { name: /format html/i }),
    ).not.toBeInTheDocument();
    // Save/mode switch remain relevant; the format action is code-only.
  });
});

describe("ContentEditor composition — provider & shell", () => {
  it("starts in WYSIWYG mode when defaultMode='wysiwyg'", () => {
    render(<Composed defaultMode='wysiwyg' />);
    expect(
      screen.getByRole("textbox", { name: /rich text editor/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /visual editor/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("renders an error message from the shell", () => {
    render(<Composed error='Something went wrong' />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Something went wrong",
    );
  });

  it("triggers onSave via Ctrl+S once there are unsaved changes", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<Composed onSave={onSave} />);

    // No changes yet → shortcut is a no-op.
    fireEvent.keyDown(window, { key: "s", ctrlKey: true });
    expect(onSave).not.toHaveBeenCalled();

    // Make a change through the WYSIWYG surface.
    fireEvent.click(screen.getByRole("button", { name: /visual editor/i }));
    const surface = screen.getByRole("textbox", { name: /rich text editor/i });
    surface.innerHTML = "<p>changed</p>";
    fireEvent.input(surface);

    fireEvent.keyDown(window, { key: "s", ctrlKey: true });
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
  });
});
