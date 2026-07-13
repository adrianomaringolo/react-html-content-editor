import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygUndo } from "./WysiwygUndo";
import { WysiwygRedo } from "./WysiwygRedo";
import { WysiwygAlignMenu } from "./WysiwygAlignMenu";

const originalExec = document.execCommand;
const originalQueryState = document.queryCommandState;

beforeEach(() => {
  document.execCommand = vi.fn(() => true) as typeof document.execCommand;
});

afterEach(() => {
  cleanup();
  document.execCommand = originalExec;
  document.queryCommandState = originalQueryState;
  vi.restoreAllMocks();
});

describe("WysiwygUndo / WysiwygRedo", () => {
  it("runs the undo and redo commands", () => {
    render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygUndo />
          <WysiwygRedo />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    fireEvent.click(screen.getByRole("button", { name: /undo/i }));
    expect(document.execCommand).toHaveBeenCalledWith("undo", false, undefined);

    fireEvent.click(screen.getByRole("button", { name: /redo/i }));
    expect(document.execCommand).toHaveBeenCalledWith("redo", false, undefined);
  });
});

describe("WysiwygAlignMenu", () => {
  const renderMenu = () =>
    render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygAlignMenu />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

  it("is closed initially and opens on click", () => {
    renderMenu();
    expect(
      screen.queryByRole("menu", { name: /text alignment/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /text alignment/i }));
    expect(
      screen.getByRole("menu", { name: /text alignment/i }),
    ).toBeInTheDocument();
    // The four alignment options are shown.
    expect(screen.getByRole("button", { name: /align left/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /align center/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /align justify/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /align right/i })).toBeInTheDocument();
  });

  it("applies an alignment and closes the picker", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: /text alignment/i }));
    fireEvent.click(screen.getByRole("button", { name: /align center/i }));

    expect(document.execCommand).toHaveBeenCalledWith(
      "justifyCenter",
      false,
      undefined,
    );
    expect(
      screen.queryByRole("menu", { name: /text alignment/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the icon of the alignment applied to the selection", () => {
    // Pretend the selection is right-aligned.
    document.queryCommandState = vi.fn(
      (cmd: string) => cmd === "justifyRight",
    ) as typeof document.queryCommandState;

    renderMenu();
    const trigger = screen.getByRole("button", { name: /text alignment/i });
    expect(trigger).toHaveAttribute("data-align", "right");
  });

  it("closes when clicking outside", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: /text alignment/i }));
    expect(
      screen.getByRole("menu", { name: /text alignment/i }),
    ).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(
      screen.queryByRole("menu", { name: /text alignment/i }),
    ).not.toBeInTheDocument();
  });
});
