/**
 * Helpers shared by the example code editor adapters.
 *
 * `CodeEditorProps.options` is deliberately untyped (`Record<string, unknown>`)
 * because every implementation understands a different set of keys. Each
 * adapter reads the handful it supports and ignores the rest.
 */

/** Reads a positive numeric option, falling back when absent or malformed. */
export const numberOption = (
  options: Record<string, unknown> | undefined,
  key: string,
  fallback: number,
): number => {
  const raw = options?.[key];
  return typeof raw === "number" && Number.isFinite(raw) && raw > 0
    ? raw
    : fallback;
};

/**
 * The `theme` prop follows Monaco's naming (`"vs-dark"` / `"vs-light"`).
 * Anything that is not explicitly light is treated as dark, which matches how
 * the built-in textarea editor reads it.
 */
export const isDarkTheme = (theme: string): boolean =>
  theme !== "vs-light" && theme !== "light";
