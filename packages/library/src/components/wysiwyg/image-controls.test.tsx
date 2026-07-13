import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygImage } from "./WysiwygImage";
import { WysiwygImageUpload } from "./WysiwygImageUpload";

// jsdom doesn't implement execCommand; spy on it to assert what gets inserted.
const originalExecCommand = document.execCommand;

beforeEach(() => {
  document.execCommand = vi.fn(() => true) as typeof document.execCommand;
});

afterEach(() => {
  cleanup();
  document.execCommand = originalExecCommand;
  vi.restoreAllMocks();
});

const fileInput = (container: HTMLElement) =>
  container.querySelector<HTMLInputElement>('input[type="file"]')!;

describe("WysiwygImage", () => {
  it("inserts a base64 data URI for a picked file (default behaviour)", async () => {
    const { container } = render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygImage />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    const file = new File(["hello"], "photo.png", { type: "image/png" });
    fireEvent.change(fileInput(container), { target: { files: [file] } });

    await waitFor(() =>
      expect(document.execCommand).toHaveBeenCalledWith(
        "insertImage",
        false,
        expect.stringMatching(/^data:image\/png;base64,/),
      ),
    );
  });

  it("inserts by URL when getSrc is provided (link mode)", async () => {
    render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygImage title='By URL' getSrc={() => "https://cdn.test/a.png"} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    fireEvent.click(screen.getByRole("button", { name: "By URL" }));

    await waitFor(() =>
      expect(document.execCommand).toHaveBeenCalledWith(
        "insertImage",
        false,
        "https://cdn.test/a.png",
      ),
    );
  });

  it("does nothing when getSrc resolves empty", async () => {
    render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygImage title='Maybe' getSrc={() => null} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Maybe" }));
    // give the awaited getSrc a tick
    await Promise.resolve();
    expect(document.execCommand).not.toHaveBeenCalledWith(
      "insertImage",
      false,
      expect.anything(),
    );
  });
});

describe("WysiwygImageUpload", () => {
  it("uploads the picked file and inserts the returned URL", async () => {
    const upload = vi.fn().mockResolvedValue("https://cdn.test/uploaded.png");
    const { container } = render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygImageUpload upload={upload} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    const file = new File(["bytes"], "up.png", { type: "image/png" });
    fireEvent.change(fileInput(container), { target: { files: [file] } });

    await waitFor(() => expect(upload).toHaveBeenCalledWith(file));
    await waitFor(() =>
      expect(document.execCommand).toHaveBeenCalledWith(
        "insertImage",
        false,
        "https://cdn.test/uploaded.png",
      ),
    );
  });

  it("calls onError and does not insert when the upload rejects", async () => {
    const err = new Error("network");
    const upload = vi.fn().mockRejectedValue(err);
    const onError = vi.fn();
    const { container } = render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygImageUpload upload={upload} onError={onError} />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    const file = new File(["bytes"], "bad.png", { type: "image/png" });
    fireEvent.change(fileInput(container), { target: { files: [file] } });

    await waitFor(() => expect(onError).toHaveBeenCalledWith(err));
    expect(document.execCommand).not.toHaveBeenCalledWith(
      "insertImage",
      false,
      expect.anything(),
    );
  });

  it("disables the control while uploading", async () => {
    let resolveUpload: (url: string) => void = () => {};
    const upload = vi.fn(
      () => new Promise<string>((res) => (resolveUpload = res)),
    );
    const { container } = render(
      <Wysiwyg defaultValue='<p>x</p>'>
        <WysiwygToolbar>
          <WysiwygImageUpload upload={upload} title='Up' />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );

    const file = new File(["bytes"], "slow.png", { type: "image/png" });
    fireEvent.change(fileInput(container), { target: { files: [file] } });

    const button = screen.getByRole("button", { name: "Up" });
    await waitFor(() => expect(button).toBeDisabled());

    resolveUpload("https://cdn.test/slow.png");
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
