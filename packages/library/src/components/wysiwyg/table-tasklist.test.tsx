import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { Wysiwyg } from "./Wysiwyg";
import { WysiwygToolbar } from "./WysiwygToolbar";
import { WysiwygContent } from "./WysiwygContent";
import { WysiwygTable, buildTableHtml } from "./WysiwygTable";
import { WysiwygTableEditor } from "./WysiwygTableEditor";
import { WysiwygTaskList } from "./WysiwygTaskList";

const originalExec = document.execCommand;

beforeEach(() => {
  document.execCommand = vi.fn(() => true) as typeof document.execCommand;
});
afterEach(() => {
  cleanup();
  document.execCommand = originalExec;
  vi.restoreAllMocks();
});

/** Move the caret into `node` and notify the editor of the selection change. */
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

describe("buildTableHtml", () => {
  it("builds a header row plus body rows", () => {
    const html = buildTableHtml(3, 2, true);
    expect(html).toContain("<thead><tr><th><br></th><th><br></th></tr></thead>");
    // 3 rows total: 1 header + 2 body
    expect(html.match(/<tr>/g)).toHaveLength(3);
    expect(html).toContain("<td><br></td>");
    expect(html.endsWith("<p><br></p>")).toBe(true);
  });

  it("omits the header when withHeaderRow is false", () => {
    const html = buildTableHtml(2, 2, false);
    expect(html).not.toContain("<thead>");
    expect(html).toContain("<tbody>");
  });
});

describe("WysiwygTable", () => {
  it("inserts a table of the picked size via insertHTML", () => {
    render(
      <Wysiwyg defaultValue='<p>hi</p>'>
        <WysiwygToolbar>
          <WysiwygTable />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /insert table/i }));
    fireEvent.click(
      screen.getByRole("menuitem", { name: /insert 2 by 3 table/i }),
    );
    expect(document.execCommand).toHaveBeenCalledWith(
      "insertHTML",
      false,
      buildTableHtml(2, 3, true),
    );
  });
});

describe("WysiwygTaskList", () => {
  it("inserts an empty task list via insertHTML", () => {
    render(
      <Wysiwyg defaultValue='<p>hi</p>'>
        <WysiwygToolbar>
          <WysiwygTaskList />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    fireEvent.click(screen.getByRole("button", { name: /task list/i }));
    expect(document.execCommand).toHaveBeenCalledWith(
      "insertHTML",
      false,
      expect.stringContaining('data-wysiwyg-task-list="true"'),
    );
  });

  it("toggles an item when its checkbox gutter is clicked", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Wysiwyg
        defaultValue='<ul data-wysiwyg-task-list="true"><li>Task</li></ul>'
        onChange={onChange}
      >
        <WysiwygToolbar>
          <WysiwygTaskList />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const li = container.querySelector("li") as HTMLLIElement;

    fireEvent.click(li, { clientX: 5 });
    expect(li.getAttribute("data-checked")).toBe("true");
    expect(onChange).toHaveBeenCalled();

    fireEvent.click(li, { clientX: 5 });
    expect(li.hasAttribute("data-checked")).toBe(false);
  });

  it("does not toggle when the click is outside the checkbox gutter", () => {
    const { container } = render(
      <Wysiwyg defaultValue='<ul data-wysiwyg-task-list="true"><li>Task</li></ul>'>
        <WysiwygToolbar>
          <WysiwygTaskList />
        </WysiwygToolbar>
        <WysiwygContent />
      </Wysiwyg>,
    );
    const li = container.querySelector("li") as HTMLLIElement;
    fireEvent.click(li, { clientX: 500 });
    expect(li.hasAttribute("data-checked")).toBe(false);
  });
});

describe("WysiwygTableEditor", () => {
  const setup = () => {
    const onChange = vi.fn();
    const utils = render(
      <Wysiwyg
        defaultValue='<table data-wysiwyg-table="true"><tbody><tr><td>a</td><td>b</td></tr></tbody></table>'
        onChange={onChange}
      >
        <WysiwygToolbar />
        <WysiwygContent />
        <WysiwygTableEditor />
      </Wysiwyg>,
    );
    const cell = utils.container.querySelector("td") as HTMLTableCellElement;
    selectInto(cell);
    return { ...utils, onChange };
  };

  it("shows the editing bar when the caret is inside a table", () => {
    setup();
    expect(
      screen.getByRole("toolbar", { name: /edit table/i }),
    ).toBeInTheDocument();
  });

  it("inserts a row below the current one", () => {
    const { container, onChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: /insert row below/i }));
    expect(container.querySelectorAll("tr")).toHaveLength(2);
    expect(onChange).toHaveBeenCalled();
  });

  it("inserts a column to the right", () => {
    const { container } = setup();
    fireEvent.click(
      screen.getByRole("button", { name: /insert column right/i }),
    );
    // One row of 2 cells + a new column → 3 cells.
    expect(container.querySelectorAll("td")).toHaveLength(3);
  });

  it("deletes the current column", () => {
    const { container } = setup();
    fireEvent.click(screen.getByRole("button", { name: /delete column/i }));
    expect(container.querySelectorAll("td")).toHaveLength(1);
  });

  it("deletes the whole table", () => {
    const { container } = setup();
    fireEvent.click(screen.getByRole("button", { name: /delete table/i }));
    expect(container.querySelector("table")).toBeNull();
  });
});
