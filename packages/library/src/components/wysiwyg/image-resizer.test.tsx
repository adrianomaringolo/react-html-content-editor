import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygImageResizer } from "./WysiwygImageResizer";

afterEach(cleanup);

function setup(onChange = vi.fn()) {
  const utils = render(
    <Wysiwyg defaultValue='<p><img src="x.png" alt="pic" /></p>' onChange={onChange}>
      <WysiwygContent />
      <WysiwygImageResizer />
    </Wysiwyg>,
  );
  const img = utils.container.querySelector("img") as HTMLImageElement;
  return { ...utils, img, onChange };
}

describe("WysiwygImageResizer", () => {
  it("shows no bar until an image is clicked", () => {
    setup();
    expect(
      screen.queryByRole("toolbar", { name: /image size/i }),
    ).not.toBeInTheDocument();
  });

  it("reveals the floating bar when an image is clicked", () => {
    const { img } = setup();
    fireEvent.click(img);
    expect(
      screen.getByRole("toolbar", { name: /image size/i }),
    ).toBeInTheDocument();
  });

  it("applies a preset width (with height auto) and persists it", () => {
    const { img, onChange } = setup();
    fireEvent.click(img);

    fireEvent.click(screen.getByRole("button", { name: /medium/i }));

    expect(img.style.width).toBe("50%");
    expect(img.style.height).toBe("auto");
    // width/height attributes are cleared so they don't fight the inline style
    expect(img.hasAttribute("width")).toBe(false);
    const lastHtml = onChange.mock.calls.at(-1)?.[0] as string;
    expect(lastHtml).toContain("width: 50%");
  });

  it("reset restores the natural size (clears the sizing)", () => {
    const { img } = setup();
    fireEvent.click(img);
    fireEvent.click(screen.getByRole("button", { name: /large/i }));
    expect(img.style.width).toBe("100%");

    fireEvent.click(screen.getByRole("button", { name: /original size/i }));
    expect(img.style.width).toBe("");
    expect(img.style.height).toBe("");
  });

  it("honours custom options", () => {
    render(
      <Wysiwyg defaultValue='<p><img src="y.png" /></p>'>
        <WysiwygContent />
        <WysiwygImageResizer
          options={[{ label: "½", width: "320px", title: "Half" }]}
          showReset={false}
        />
      </Wysiwyg>,
    );
    const img = document.querySelector("img") as HTMLImageElement;
    fireEvent.click(img);
    fireEvent.click(screen.getByRole("button", { name: /half/i }));
    expect(img.style.width).toBe("320px");
    expect(
      screen.queryByRole("button", { name: /original size/i }),
    ).not.toBeInTheDocument();
  });

  it("hides the bar when clicking outside", () => {
    const { img } = setup();
    fireEvent.click(img);
    expect(screen.getByRole("toolbar", { name: /image size/i })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(
      screen.queryByRole("toolbar", { name: /image size/i }),
    ).not.toBeInTheDocument();
  });
});
