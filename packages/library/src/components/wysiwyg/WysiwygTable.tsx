import React, { useState } from "react";
import { Table as TableIcon } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

/** Insert a table, sized from a hover grid picker. */
export interface WysiwygTableProps extends NamedControlProps {
  /** Rows offered in the size picker (default: `8`). */
  maxRows?: number;
  /** Columns offered in the size picker (default: `8`). */
  maxCols?: number;
  /** Render the first row as header cells (`<th>`). Default: `true`. */
  withHeaderRow?: boolean;
}

/** Build the HTML for a `rows`×`cols` table, optionally with a header row. */
export function buildTableHtml(
  rows: number,
  cols: number,
  header: boolean,
): string {
  const cells = (tag: "td" | "th") =>
    Array.from({ length: cols }, () => `<${tag}><br></${tag}>`).join("");
  let thead = "";
  let firstBodyRow = 0;
  if (header && rows > 0) {
    thead = `<thead><tr>${cells("th")}</tr></thead>`;
    firstBodyRow = 1;
  }
  const bodyRows: string[] = [];
  for (let r = firstBodyRow; r < rows; r++) {
    bodyRows.push(`<tr>${cells("td")}</tr>`);
  }
  const tbody = bodyRows.length ? `<tbody>${bodyRows.join("")}</tbody>` : "";
  // Trailing paragraph so the caret has somewhere to land after the table.
  return `<table data-wysiwyg-table="true">${thead}${tbody}</table><p><br></p>`;
}

/**
 * Insert a table into the editor. The trigger opens a grid where you drag to
 * choose the number of rows and columns; releasing inserts the table.
 *
 * Pair with {@link WysiwygTableEditor} to add/remove rows and columns once a
 * table is in the content.
 */
export const WysiwygTable: React.FC<WysiwygTableProps> = ({
  className,
  title = "Insert table",
  maxRows = 8,
  maxCols = 8,
  withHeaderRow = true,
}) => {
  const { exec } = useWysiwygContext();
  const [hover, setHover] = useState({ rows: 0, cols: 0 });

  const insert = (rows: number, cols: number) =>
    exec("insertHTML", buildTableHtml(rows, cols, withHeaderRow));

  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<TableIcon size={16} aria-hidden='true' />}
    >
      <div
        className={styles.tablePicker}
        onMouseLeave={() => setHover({ rows: 0, cols: 0 })}
      >
        <div
          className={styles.tableGrid}
          style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}
        >
          {Array.from({ length: maxRows }).map((_, r) =>
            Array.from({ length: maxCols }).map((_, c) => {
              const on = r < hover.rows && c < hover.cols;
              return (
                <button
                  key={`${r}-${c}`}
                  type='button'
                  role='menuitem'
                  aria-label={`Insert ${r + 1} by ${c + 1} table`}
                  className={`${styles.tableCell} ${on ? styles.tableCellOn : ""}`.trim()}
                  onMouseEnter={() => setHover({ rows: r + 1, cols: c + 1 })}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => insert(r + 1, c + 1)}
                />
              );
            }),
          )}
        </div>
        <div className={styles.tablePickerLabel}>
          {hover.rows > 0 ? `${hover.rows} × ${hover.cols}` : "Pick a size"}
        </div>
      </div>
    </WysiwygDropdown>
  );
};
