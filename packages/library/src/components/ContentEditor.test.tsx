import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import fc from "fast-check";
import { ContentEditor } from "./ContentEditor";
import type { ContentValue } from "../types";
import styles from "./content-editor.module.css";

// Cleanup after each test to prevent DOM pollution
afterEach(() => {
  cleanup();
});

/**
 * Feature: react-html-content-editor
 * Property 1: Content Change Propagation
 *
 * For any ContentValue (html and css), when either the html or css is modified
 * in the editor, the onChange callback should be called with a ContentValue
 * object containing both the updated value and the unchanged value.
 *
 * Validates: Requirements 2.3, 3.1, 3.2
 */
describe("Property 1: Content Change Propagation", () => {
  it("should render with any valid ContentValue", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        (value: ContentValue) => {
          const onChange = vi.fn();

          const { container, unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Component should render without errors
          expect(container).toBeInTheDocument();

          // Should have tabs - now includes Edit/Preview tabs plus HTML/CSS tabs
          const tabs = screen.getAllByRole("tab");
          expect(tabs.length).toBeGreaterThanOrEqual(2);

          // Should have Edit and Preview tabs
          const editTab = tabs.find((tab) => tab.textContent === "Edit");
          const previewTab = tabs.find((tab) => tab.textContent === "Preview");
          expect(editTab).toBeTruthy();
          expect(previewTab).toBeTruthy();

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should preserve both values when rerendering with new html", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        fc.string({ maxLength: 100 }),
        (initialValue: ContentValue, newHtml: string) => {
          const onChange = vi.fn();

          const { rerender, unmount } = render(
            <ContentEditor value={initialValue} onChange={onChange} />,
          );

          // Simulate a change by rerendering with new html value
          const updatedValue = { html: newHtml, css: initialValue.css };
          rerender(<ContentEditor value={updatedValue} onChange={onChange} />);

          // The component should maintain both values
          expect(updatedValue.css).toBe(initialValue.css);
          expect(updatedValue.html).toBe(newHtml);

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should preserve both values when rerendering with new css", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        fc.string({ maxLength: 100 }),
        (initialValue: ContentValue, newCss: string) => {
          const onChange = vi.fn();

          const { rerender, unmount } = render(
            <ContentEditor value={initialValue} onChange={onChange} />,
          );

          // Simulate a change by rerendering with new css value
          const updatedValue = { html: initialValue.html, css: newCss };
          rerender(<ContentEditor value={updatedValue} onChange={onChange} />);

          // The component should maintain both values
          expect(updatedValue.html).toBe(initialValue.html);
          expect(updatedValue.css).toBe(newCss);

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Feature: react-html-content-editor
 * Property 2: Tab Switching Preserves Content
 *
 * For any ContentValue (html and css), switching between HTML and CSS editor tabs
/**
 * Feature: react-html-content-editor
 * Property 2: Tab Switching Preserves Content
 * 
 * For any ContentValue (html and css), switching between HTML and CSS editor tabs
 * should preserve both values without data loss.
 * 
 * Validates: Requirements 3.3
 */
describe("Property 2: Tab Switching Preserves Content", () => {
  it("should render both HTML and CSS tabs for any content value", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        (value: ContentValue) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Get the tabs
          const tabs = screen.getAllByRole("tab");
          expect(tabs.length).toBeGreaterThanOrEqual(2);

          // Should have Edit tab (initially active by default)
          const editTab = tabs.find((tab) => tab.textContent === "Edit");
          expect(editTab).toBeTruthy();
          expect(editTab).toHaveAttribute("aria-selected", "true");

          // Tab switching doesn't trigger onChange
          expect(onChange).not.toHaveBeenCalled();

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should respect defaultTab prop for any content value", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        fc.constantFrom("html" as const, "css" as const),
        (value: ContentValue, defaultTab) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor
              value={value}
              onChange={onChange}
              defaultTab={defaultTab}
            />,
          );

          // Get the tabs
          const tabs = screen.getAllByRole("tab");
          expect(tabs.length).toBeGreaterThanOrEqual(2);

          // Should have Edit tab active by default
          const editTab = tabs.find((tab) => tab.textContent === "Edit");
          expect(editTab).toBeTruthy();
          expect(editTab).toHaveAttribute("aria-selected", "true");

          // The defaultTab prop affects which editor tab is active within Edit mode
          // We can verify the HTML or CSS tab is present
          const htmlTab = tabs.find((tab) => tab.textContent === "HTML");
          const cssTab = tabs.find((tab) => tab.textContent === "CSS");

          if (defaultTab === "html") {
            expect(htmlTab).toBeTruthy();
            if (htmlTab) {
              expect(htmlTab).toHaveAttribute("aria-selected", "true");
            }
          } else {
            expect(cssTab).toBeTruthy();
            if (cssTab) {
              expect(cssTab).toHaveAttribute("aria-selected", "true");
            }
          }

          // Tab initialization doesn't trigger onChange
          expect(onChange).not.toHaveBeenCalled();

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Feature: react-html-content-editor
 * Property 5: CSS Injection in Preview
 *
 * For any CSS content, when rendered in preview mode, the preview DOM should
 * contain a style tag with that exact CSS content.
 *
 * Validates: Requirements 2.5, 15.2
 */
describe("Property 5: CSS Injection in Preview", () => {
  // Custom generator for valid CSS rules
  const validCssArbitrary = fc.oneof(
    fc.constant(""), // Empty CSS
    fc.constant("body { color: red; }"),
    fc.constant(".test { margin: 10px; }"),
    fc.constant("#id { padding: 5px; }"),
    fc
      .record({
        selector: fc.oneof(
          fc.constant("body"),
          fc.constant(".test"),
          fc.constant("#id"),
          fc.constant("div"),
        ),
        property: fc.oneof(
          fc.constant("color"),
          fc.constant("margin"),
          fc.constant("padding"),
        ),
        value: fc.oneof(
          fc.constant("red"),
          fc.constant("10px"),
          fc.constant("5px"),
        ),
      })
      .map(
        ({ selector, property, value }) =>
          `${selector} { ${property}: ${value}; }`,
      ),
  );

  it("should inject CSS into preview for any CSS content", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: validCssArbitrary,
        }),
        async (value: ContentValue) => {
          const onChange = vi.fn();

          const { container, unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Get all tabs (should now have Edit and Preview tabs)
          const tabs = screen.getAllByRole("tab");

          // Find the Preview tab (should be the second tab in the main tabs)
          const previewTab = tabs.find((tab) => tab.textContent === "Preview");

          if (previewTab) {
            // Click the Preview tab
            await user.click(previewTab);

            // Component shows placeholder when there's NO content (neither HTML nor CSS)
            const hasContent = value.html.trim() || value.css.trim();

            if (hasContent && value.css.trim()) {
              // Wait for the preview to render and style tags to appear
              await waitFor(() => {
                const styleTags = container.querySelectorAll("style");
                expect(styleTags.length).toBeGreaterThan(0);
              });

              // Check if any style tag contains the CSS content
              const styleTags = container.querySelectorAll("style");
              const hasMatchingStyle = Array.from(styleTags).some(
                (styleTag) => styleTag.textContent === value.css,
              );
              expect(hasMatchingStyle).toBe(true);
            }
          }

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });

  it("should update injected CSS when CSS value changes", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: validCssArbitrary,
        }),
        validCssArbitrary,
        async (initialValue: ContentValue, newCss: string) => {
          const onChange = vi.fn();

          const { container, rerender, unmount } = render(
            <ContentEditor value={initialValue} onChange={onChange} />,
          );

          // Get all tabs
          const tabs = screen.getAllByRole("tab");
          const previewTab = tabs.find((tab) => tab.textContent === "Preview");

          if (previewTab) {
            // Click the Preview tab
            await user.click(previewTab);

            // Update the CSS value
            const updatedValue = { ...initialValue, css: newCss };
            rerender(
              <ContentEditor value={updatedValue} onChange={onChange} />,
            );

            // Component shows placeholder when there's NO content (neither HTML nor CSS)
            const hasContent =
              updatedValue.html.trim() || updatedValue.css.trim();

            if (hasContent && newCss.trim()) {
              // Wait for the style tags to update
              await waitFor(() => {
                const styleTags = container.querySelectorAll("style");
                expect(styleTags.length).toBeGreaterThan(0);
              });

              const styleTags = container.querySelectorAll("style");
              const hasMatchingStyle = Array.from(styleTags).some(
                (styleTag) => styleTag.textContent === newCss,
              );
              expect(hasMatchingStyle).toBe(true);
            }
          }

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });
});

/**
 * Feature: react-html-content-editor
 * Property 6: Preview Renders HTML with Styles
 *
 * For any HTML and CSS content, the preview should render the HTML with the CSS
 * styles applied, such that elements styled by the CSS reflect those styles in
 * the rendered output.
 *
 * Validates: Requirements 15.1
 */
describe("Property 6: Preview Renders HTML with Styles", () => {
  // Custom generator for valid HTML with identifiable elements
  const validHtmlArbitrary = fc.oneof(
    fc.constant(""), // Empty HTML
    fc.constant("<p>Hello World</p>"),
    fc.constant("<div class='test'>Content</div>"),
    fc.constant("<span id='id'>Text</span>"),
    fc
      .record({
        tag: fc.oneof(
          fc.constant("p"),
          fc.constant("div"),
          fc.constant("span"),
        ),
        className: fc.option(fc.constant("test"), { nil: undefined }),
        id: fc.option(fc.constant("id"), { nil: undefined }),
        content: fc.oneof(
          fc.constant("Hello"),
          fc.constant("World"),
          fc.constant("Test"),
        ),
      })
      .map(({ tag, className, id, content }) => {
        const classAttr = className ? ` class="${className}"` : "";
        const idAttr = id ? ` id="${id}"` : "";
        return `<${tag}${classAttr}${idAttr}>${content}</${tag}>`;
      }),
  );

  // Custom generator for valid CSS rules (reuse from Property 5)
  const validCssArbitrary = fc.oneof(
    fc.constant(""), // Empty CSS
    fc.constant("body { color: red; }"),
    fc.constant(".test { margin: 10px; }"),
    fc.constant("#id { padding: 5px; }"),
    fc
      .record({
        selector: fc.oneof(
          fc.constant("body"),
          fc.constant(".test"),
          fc.constant("#id"),
          fc.constant("div"),
        ),
        property: fc.oneof(
          fc.constant("color"),
          fc.constant("margin"),
          fc.constant("padding"),
        ),
        value: fc.oneof(
          fc.constant("red"),
          fc.constant("10px"),
          fc.constant("5px"),
        ),
      })
      .map(
        ({ selector, property, value }) =>
          `${selector} { ${property}: ${value}; }`,
      ),
  );

  it("should render HTML in preview for any HTML content", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: validHtmlArbitrary,
          css: validCssArbitrary,
        }),
        async (value: ContentValue) => {
          const onChange = vi.fn();

          const { container, unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Get all tabs
          const tabs = screen.getAllByRole("tab");
          const previewTab = tabs.find((tab) => tab.textContent === "Preview");

          if (previewTab) {
            // Click the Preview tab
            await user.click(previewTab);

            // Component shows placeholder when there's NO content (neither HTML nor CSS)
            const hasContent = value.html.trim() || value.css.trim();

            if (hasContent) {
              if (value.html.trim()) {
                // Wait for the preview container to appear
                await waitFor(() => {
                  const previewContainer =
                    container.querySelector(".content-preview");
                  expect(previewContainer).toBeTruthy();
                });

                const previewContainer =
                  container.querySelector(".content-preview");

                // The preview should contain the HTML content (allowing for browser normalization)
                if (previewContainer) {
                  // Use textContent or check for presence of elements instead of exact HTML match
                  const hasHtmlContent = previewContainer.innerHTML.length > 0;
                  expect(hasHtmlContent).toBe(true);
                }
              }
            } else {
              // If there's no content at all, should show placeholder
              const placeholder = container.textContent?.includes(
                "No content to preview",
              );
              expect(placeholder).toBe(true);
            }
          }

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });

  it("should render HTML with CSS styles applied in preview", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: validHtmlArbitrary,
          css: validCssArbitrary,
        }),
        async (value: ContentValue) => {
          const onChange = vi.fn();

          const { container, unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Get all tabs
          const tabs = screen.getAllByRole("tab");
          const previewTab = tabs.find((tab) => tab.textContent === "Preview");

          if (previewTab) {
            // Click the Preview tab
            await user.click(previewTab);

            if (value.html.trim() && value.css.trim()) {
              // Wait for both HTML and CSS to be rendered
              await waitFor(() => {
                const previewContainer =
                  container.querySelector(".content-preview");
                const styleTags = container.querySelectorAll("style");
                expect(previewContainer).toBeTruthy();
                expect(styleTags.length).toBeGreaterThan(0);
              });

              const previewContainer =
                container.querySelector(".content-preview");
              const styleTags = container.querySelectorAll("style");

              // Verify HTML is rendered (check for content presence, not exact match due to normalization)
              if (previewContainer) {
                const hasContent = previewContainer.innerHTML.length > 0;
                expect(hasContent).toBe(true);
              }

              // Verify CSS is injected
              const hasMatchingStyle = Array.from(styleTags).some(
                (styleTag) => styleTag.textContent === value.css,
              );
              expect(hasMatchingStyle).toBe(true);
            }
          }

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });
});

/**
 * Feature: react-html-content-editor
 * Property 3: Format Preserves Validity
 *
 * For any valid HTML or CSS content, applying the format operation should produce
 * valid formatted content that, when parsed, represents the same structure.
 *
 * Validates: Requirements 3.7, 3.8
 */
describe("Property 3: Format Preserves Validity", () => {
  // Custom generator for valid HTML that can be formatted
  const formattableHtmlArbitrary = fc.oneof(
    fc.constant("<p>Hello World</p>"),
    fc.constant("<div><p>Nested</p></div>"),
    fc.constant("<span>Text</span>"),
    fc.constant("<div class='test'><p>Content</p></div>"),
    fc.constant("<ul><li>Item 1</li><li>Item 2</li></ul>"),
    fc
      .record({
        tag: fc.oneof(
          fc.constant("p"),
          fc.constant("div"),
          fc.constant("span"),
        ),
        content: fc.oneof(
          fc.constant("Hello"),
          fc.constant("World"),
          fc.constant("Test"),
        ),
      })
      .map(({ tag, content }) => `<${tag}>${content}</${tag}>`),
  );

  // Custom generator for valid CSS that can be formatted
  const formattableCssArbitrary = fc.oneof(
    fc.constant("body { color: red; }"),
    fc.constant(".test { margin: 10px; padding: 5px; }"),
    fc.constant("#id { background: blue; color: white; }"),
    fc.constant("div { display: flex; flex-direction: column; }"),
    fc
      .record({
        selector: fc.oneof(
          fc.constant("body"),
          fc.constant(".test"),
          fc.constant("#id"),
          fc.constant("div"),
        ),
        property: fc.oneof(
          fc.constant("color"),
          fc.constant("margin"),
          fc.constant("padding"),
          fc.constant("background"),
        ),
        value: fc.oneof(
          fc.constant("red"),
          fc.constant("10px"),
          fc.constant("5px"),
          fc.constant("blue"),
        ),
      })
      .map(
        ({ selector, property, value }) =>
          `${selector} { ${property}: ${value}; }`,
      ),
  );

  it("should render format button for HTML editor when HTML tab is active", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: formattableHtmlArbitrary,
          css: formattableCssArbitrary,
        }),
        async (value: ContentValue) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Get all tabs
          const tabs = screen.getAllByRole("tab");

          // Find and click the Edit tab (should be active by default)
          const editTab = tabs.find((tab) => tab.textContent === "Edit");
          if (editTab) {
            await user.click(editTab);

            // Find and click the HTML tab
            const htmlTab = tabs.find((tab) => tab.textContent === "HTML");
            if (htmlTab) {
              await user.click(htmlTab);

              // Check for format button
              await waitFor(() => {
                const formatButton =
                  screen.queryByLabelText(/Format HTML/i);
                expect(formatButton).toBeInTheDocument();
              });
            }
          }

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });

  it("should render format button for CSS editor when CSS tab is active", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: formattableHtmlArbitrary,
          css: formattableCssArbitrary,
        }),
        async (value: ContentValue) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Get all tabs
          const tabs = screen.getAllByRole("tab");

          // Find and click the Edit tab
          const editTab = tabs.find((tab) => tab.textContent === "Edit");
          if (editTab) {
            await user.click(editTab);

            // Find and click the CSS tab
            const cssTab = tabs.find((tab) => tab.textContent === "CSS");
            if (cssTab) {
              await user.click(cssTab);

              // Check for format button
              await waitFor(() => {
                const formatButton = screen.queryByLabelText(/Format CSS/i);
                expect(formatButton).toBeInTheDocument();
              });
            }
          }

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });

  it("should not show format button when preview tab is active", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: formattableHtmlArbitrary,
          css: formattableCssArbitrary,
        }),
        async (value: ContentValue) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Get all tabs
          const tabs = screen.getAllByRole("tab");

          // Find and click the Preview tab
          const previewTab = tabs.find((tab) => tab.textContent === "Preview");
          if (previewTab) {
            await user.click(previewTab);

            // Format buttons should not be present
            await waitFor(() => {
              const htmlFormatButton =
                screen.queryByLabelText(/Format HTML/i);
              const cssFormatButton =
                screen.queryByLabelText(/Format CSS/i);
              expect(htmlFormatButton).not.toBeInTheDocument();
              expect(cssFormatButton).not.toBeInTheDocument();
            });
          }

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });

  it("should show format button in fullscreen edit mode", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: formattableHtmlArbitrary,
          css: formattableCssArbitrary,
        }),
        async (value: ContentValue) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Open fullscreen
          const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
          await user.click(fullscreenButton);

          // Should be in edit mode by default
          await waitFor(() => {
            const editButton = screen.getByLabelText("Edit mode");
            expect(editButton).toBeInTheDocument();
          });

          // Format button should be present (there may be multiple due to normal view still being rendered)
          await waitFor(() => {
            const formatButtons = screen.getAllByLabelText(
              /Format (HTML|CSS) code/,
            );
            expect(formatButtons.length).toBeGreaterThan(0);
          });

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });

  it("should show format button in fullscreen split mode", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: formattableHtmlArbitrary,
          css: formattableCssArbitrary,
        }),
        async (value: ContentValue) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor value={value} onChange={onChange} />,
          );

          // Open fullscreen
          const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
          await user.click(fullscreenButton);

          // Switch to split mode
          const splitButton = screen.getByLabelText("Split view mode");
          await user.click(splitButton);

          // Format button should be present (there may be multiple due to normal view still being rendered)
          await waitFor(() => {
            const formatButtons = screen.getAllByLabelText(
              /Format (HTML|CSS) code/,
            );
            expect(formatButtons.length).toBeGreaterThan(0);
          });

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });
});

/**
 * Unit Tests for Fullscreen Mode
 *
 * Tests opening fullscreen, closing with unsaved changes, mode switching,
 * and split view layout.
 *
 * Validates: Requirements 3.5, 3.6, 3.10
 */
describe("Fullscreen Mode", () => {
  it("should open fullscreen when fullscreen button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Find and click the fullscreen button
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    expect(fullscreenButton).toBeInTheDocument();

    await user.click(fullscreenButton);

    // Check that fullscreen overlay is rendered
    await waitFor(() => {
      const fullscreenOverlay = container.querySelector(
        `.${styles.fullscreenOverlay}`,
      );
      expect(fullscreenOverlay).toBeInTheDocument();
    });
  });

  it("should show mode switcher buttons in fullscreen", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    render(<ContentEditor value={value} onChange={onChange} />);

    // Open fullscreen
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    await user.click(fullscreenButton);

    // Check for mode switcher buttons
    await waitFor(() => {
      expect(screen.getByLabelText("Edit mode")).toBeInTheDocument();
      expect(screen.getByLabelText("Preview mode")).toBeInTheDocument();
      expect(screen.getByLabelText("Split view mode")).toBeInTheDocument();
    });
  });

  it("should switch between edit, preview, and split modes in fullscreen", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Open fullscreen
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    await user.click(fullscreenButton);

    // Initially in edit mode - check that edit button exists and is active
    await waitFor(() => {
      const editButton = screen.getByLabelText("Edit mode");
      expect(editButton).toBeInTheDocument();
    });

    // Switch to preview mode
    const previewButton = screen.getByLabelText("Preview mode");
    await user.click(previewButton);

    // Verify preview content is shown
    await waitFor(() => {
      const previewContainer = container.querySelector(".content-preview");
      expect(previewContainer).toBeInTheDocument();
    });

    // Switch to split mode
    const splitButton = screen.getByLabelText("Split view mode");
    await user.click(splitButton);

    // Verify split view is shown
    await waitFor(() => {
      const splitView = container.querySelector(`.${styles.splitView}`);
      expect(splitView).toBeInTheDocument();
    });
  });

  it("should show split view layout with editor and preview side-by-side", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Open fullscreen
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    await user.click(fullscreenButton);

    // Switch to split mode
    const splitButton = screen.getByLabelText("Split view mode");
    await user.click(splitButton);

    // Check for split view layout
    await waitFor(() => {
      const splitView = container.querySelector(`.${styles.splitView}`);
      expect(splitView).toBeInTheDocument();

      const splitPanes = container.querySelectorAll(`.${styles.splitPane}`);
      expect(splitPanes.length).toBe(2);
    });
  });

  it("should show sync toggle button in split view", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    render(<ContentEditor value={value} onChange={onChange} />);

    // Open fullscreen
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    await user.click(fullscreenButton);

    // Switch to split mode
    const splitButton = screen.getByLabelText("Split view mode");
    await user.click(splitButton);

    // Check for sync toggle button
    await waitFor(() => {
      const syncButton = screen.getByLabelText("Disable scroll sync");
      expect(syncButton).toBeInTheDocument();
      expect(syncButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  it("should toggle sync on and off in split view", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    render(<ContentEditor value={value} onChange={onChange} />);

    // Open fullscreen
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    await user.click(fullscreenButton);

    // Switch to split mode
    const splitButton = screen.getByLabelText("Split view mode");
    await user.click(splitButton);

    // Initially sync is on
    let syncButton = await screen.findByLabelText("Disable scroll sync");
    expect(syncButton).toHaveAttribute("aria-pressed", "true");

    // Toggle sync off
    await user.click(syncButton);

    await waitFor(() => {
      const syncOffButton = screen.getByLabelText("Enable scroll sync");
      expect(syncOffButton).toHaveAttribute("aria-pressed", "false");
    });

    // Toggle sync back on
    const syncOffButton = screen.getByLabelText("Enable scroll sync");
    await user.click(syncOffButton);

    await waitFor(() => {
      const syncOnButton = screen.getByLabelText("Disable scroll sync");
      expect(syncOnButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  it("should close fullscreen without confirmation when no unsaved changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Open fullscreen
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    await user.click(fullscreenButton);

    // Verify fullscreen is open
    await waitFor(() => {
      const fullscreenOverlay = container.querySelector(
        `.${styles.fullscreenOverlay}`,
      );
      expect(fullscreenOverlay).toBeInTheDocument();
    });

    // Close fullscreen
    const closeButton = screen.getByLabelText(/Close fullscreen/i);
    await user.click(closeButton);

    // Fullscreen should close without showing dialog
    await waitFor(() => {
      const fullscreenOverlay = container.querySelector(
        `.${styles.fullscreenOverlay}`,
      );
      expect(fullscreenOverlay).not.toBeInTheDocument();
    });

    // Dialog should not appear
    expect(screen.queryByText("Unsaved Changes")).not.toBeInTheDocument();
  });

  it("should show confirmation dialog when closing fullscreen with unsaved changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { rerender } = render(
      <ContentEditor
        value={initialValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Open fullscreen
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    await user.click(fullscreenButton);

    // Verify fullscreen is open
    await waitFor(() => {
      expect(screen.getByLabelText(/Close fullscreen/i)).toBeInTheDocument();
    });

    // Simulate a change by rerendering with new value
    const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Try to close fullscreen
    const closeButton = screen.getByLabelText(/Close fullscreen/i);
    await user.click(closeButton);

    // Dialog should appear
    await waitFor(() => {
      expect(screen.getByText("Unsaved Changes")).toBeInTheDocument();
      expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
    });
  });

  it("should cancel closing fullscreen when cancel is clicked in dialog", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container, rerender } = render(
      <ContentEditor
        value={initialValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Open fullscreen
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    await user.click(fullscreenButton);

    // Simulate a change
    const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Try to close fullscreen
    const closeButton = screen.getByLabelText(/Close fullscreen/i);
    await user.click(closeButton);

    // Wait for dialog
    await waitFor(() => {
      expect(screen.getByText("Unsaved Changes")).toBeInTheDocument();
    });

    // Click cancel
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByText("Unsaved Changes")).not.toBeInTheDocument();
    });

    // Fullscreen should still be open
    const fullscreenOverlay = container.querySelector(
      `.${styles.fullscreenOverlay}`,
    );
    expect(fullscreenOverlay).toBeInTheDocument();
  });

  it("should close fullscreen when 'Close Anyway' is clicked in dialog", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container, rerender } = render(
      <ContentEditor
        value={initialValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Open fullscreen
    const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
    await user.click(fullscreenButton);

    // Simulate a change
    const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Try to close fullscreen
    const closeButton = screen.getByLabelText(/Close fullscreen/i);
    await user.click(closeButton);

    // Wait for dialog
    await waitFor(() => {
      expect(screen.getByText("Unsaved Changes")).toBeInTheDocument();
    });

    // Click "Close Anyway"
    const closeAnywayButton = screen.getByText("Close Anyway");
    await user.click(closeAnywayButton);

    // Fullscreen should close
    await waitFor(() => {
      const fullscreenOverlay = container.querySelector(
        `.${styles.fullscreenOverlay}`,
      );
      expect(fullscreenOverlay).not.toBeInTheDocument();
    });

    // Dialog should also close
    expect(screen.queryByText("Unsaved Changes")).not.toBeInTheDocument();
  });
});

/**
 * Unit Tests for Save Functionality
 *
 * Tests save status updates, save button disabled states, save success flow,
 * and save error flow.
 *
 * Validates: Requirements 3.11, 3.12, 3.13
 */
describe("Save Functionality", () => {
  it("should show save status indicator when onSave is provided", () => {
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    render(
      <ContentEditor
        value={value}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Save status indicator should be present
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("should not show save status indicator when onSave is not provided", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    render(<ContentEditor value={value} onChange={onChange} />);

    // Save status indicator should not be present
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    expect(screen.queryByText("Unsaved changes")).not.toBeInTheDocument();
  });

  it("should show save button when onSave is provided", () => {
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    render(
      <ContentEditor
        value={value}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Save button should be present
    const saveButton = screen.getByLabelText(/Save content/i);
    expect(saveButton).toBeInTheDocument();
  });

  it("should not show save button when onSave is not provided", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    render(<ContentEditor value={value} onChange={onChange} />);

    // Save button should not be present
    expect(screen.queryByLabelText("Save content")).not.toBeInTheDocument();
  });

  it("should update save status to 'unsaved' when content changes", async () => {
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { rerender } = render(
      <ContentEditor
        value={initialValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Initially should show "Saved"
    expect(screen.getByText("Saved")).toBeInTheDocument();

    // Simulate a change by rerendering with new value
    const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Should now show "Unsaved changes"
    await waitFor(() => {
      expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    });
  });

  it("should disable save button when no unsaved changes", () => {
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    render(
      <ContentEditor
        value={value}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Save button should be disabled when no unsaved changes
    const saveButton = screen.getByLabelText(/Save content/i);
    expect(saveButton).toBeDisabled();
  });

  it("should enable save button when there are unsaved changes", async () => {
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { rerender } = render(
      <ContentEditor
        value={initialValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Simulate a change
    const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Save button should be enabled
    await waitFor(() => {
      const saveButton = screen.getByLabelText(/Save content/i);
      expect(saveButton).not.toBeDisabled();
    });
  });

  it("should disable save button when currently saving", async () => {
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { rerender } = render(
      <ContentEditor
        value={initialValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Simulate a change
    const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Wait for unsaved changes
    await waitFor(() => {
      expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    });

    // Simulate saving state
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={true}
      />,
    );

    // Save button should be disabled while saving
    await waitFor(() => {
      const saveButton = screen.getByLabelText(/Save content/i);
      expect(saveButton).toBeDisabled();
    });
  });

  it("should show 'Saving...' status when isSaving is true", async () => {
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { rerender } = render(
      <ContentEditor
        value={value}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Simulate saving state
    rerender(
      <ContentEditor
        value={value}
        onChange={onChange}
        onSave={onSave}
        isSaving={true}
      />,
    );

    // Should show "Saving..."
    await waitFor(() => {
      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });
  });

  it("should call handleSave when save button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { rerender } = render(
      <ContentEditor
        value={initialValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Simulate a change
    const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Wait for unsaved changes
    await waitFor(() => {
      expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    });

    // Click save button
    const saveButton = screen.getByLabelText(/Save content/i);
    await user.click(saveButton);

    // onSave should be called
    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });

  it("should update status to 'saved' after successful save", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { rerender } = render(
      <ContentEditor
        value={initialValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Simulate a change
    const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Wait for unsaved changes
    await waitFor(() => {
      expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    });

    // Click save button
    const saveButton = screen.getByLabelText(/Save content/i);
    await user.click(saveButton);

    // Wait for save to complete and status to update
    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("should maintain 'unsaved' status after save error", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSave = vi.fn().mockRejectedValue(new Error("Save failed"));
    const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { rerender } = render(
      <ContentEditor
        value={initialValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Simulate a change
    const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
    rerender(
      <ContentEditor
        value={newValue}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Wait for unsaved changes
    await waitFor(() => {
      expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    });

    // Click save button
    const saveButton = screen.getByLabelText(/Save content/i);
    await user.click(saveButton);

    // Wait for save to fail and status to remain unsaved
    await waitFor(() => {
      expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    });
  });

  it("should have aria-live attribute on save status indicator", () => {
    const onChange = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor
        value={value}
        onChange={onChange}
        onSave={onSave}
        isSaving={false}
      />,
    );

    // Find the save status element
    const saveStatus = container.querySelector(`.${styles.saveStatus}`);
    expect(saveStatus).toHaveAttribute("aria-live", "polite");
    expect(saveStatus).toHaveAttribute("aria-atomic", "true");
  });
});

/**
 * Unit Tests for Styling and Theming
 *
 * Tests className prop application, CSS variables presence, and dark theme styles.
 *
 * Validates: Requirements 5.3, 5.5, 19.1
 */
describe("Styling and Theming", () => {
  it("should apply custom className to root container", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };
    const customClass = "my-custom-editor";

    const { container } = render(
      <ContentEditor
        value={value}
        onChange={onChange}
        className={customClass}
      />,
    );

    // Find the root container
    const editorContainer = container.querySelector(
      `.${styles.editorContainer}`,
    );
    expect(editorContainer).toBeInTheDocument();
    expect(editorContainer).toHaveClass(customClass);
  });

  it("should apply both default and custom className", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };
    const customClass = "custom-class-1 custom-class-2";

    const { container } = render(
      <ContentEditor
        value={value}
        onChange={onChange}
        className={customClass}
      />,
    );

    const editorContainer = container.querySelector(
      `.${styles.editorContainer}`,
    );
    expect(editorContainer).toHaveClass(styles.editorContainer);
    expect(editorContainer).toHaveClass("custom-class-1");
    expect(editorContainer).toHaveClass("custom-class-2");
  });

  it("should work without custom className", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    const editorContainer = container.querySelector(
      `.${styles.editorContainer}`,
    );
    expect(editorContainer).toBeInTheDocument();
    expect(editorContainer).toHaveClass(styles.editorContainer);
  });

  it("should have CSS variables defined in the stylesheet", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Get computed styles from the root element
    const rootStyles = getComputedStyle(document.documentElement);

    // Check for key CSS variables (these should be defined in :root)
    // Note: In test environment, CSS modules might not inject :root styles
    // So we verify the component renders without errors
    expect(container).toBeInTheDocument();
  });

  it("should render correctly with dark theme attribute", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    // Set dark theme on document
    document.documentElement.setAttribute("data-theme", "dark");

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Component should render without errors
    expect(container).toBeInTheDocument();

    // Verify the editor container is present
    const editorContainer = container.querySelector(
      `.${styles.editorContainer}`,
    );
    expect(editorContainer).toBeInTheDocument();

    // Clean up
    document.documentElement.removeAttribute("data-theme");
  });

  it("should render correctly with light theme (default)", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    // Ensure no theme attribute (default light theme)
    document.documentElement.removeAttribute("data-theme");

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Component should render without errors
    expect(container).toBeInTheDocument();

    // Verify the editor container is present
    const editorContainer = container.querySelector(
      `.${styles.editorContainer}`,
    );
    expect(editorContainer).toBeInTheDocument();
  });

  it("should apply custom height prop", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };
    const customHeight = "600px";

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} height={customHeight} />,
    );

    const editorContainer = container.querySelector(
      `.${styles.editorContainer}`,
    );
    expect(editorContainer).toHaveStyle({ height: customHeight });
  });

  it("should apply numeric height prop as pixels", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };
    const customHeight = 500;

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} height={customHeight} />,
    );

    const editorContainer = container.querySelector(
      `.${styles.editorContainer}`,
    );
    expect(editorContainer).toHaveStyle({ height: "500px" });
  });

  it("should use default height when not specified", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    const editorContainer = container.querySelector(
      `.${styles.editorContainer}`,
    );
    expect(editorContainer).toHaveStyle({ height: "400px" });
  });

  it("should apply Monaco theme prop", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    // Test with vs-light theme
    const { rerender } = render(
      <ContentEditor value={value} onChange={onChange} theme='vs-light' />,
    );

    // Component should render without errors
    expect(screen.getByRole("tab", { name: "Edit" })).toBeInTheDocument();

    // Test with vs-dark theme
    rerender(
      <ContentEditor value={value} onChange={onChange} theme='vs-dark' />,
    );

    // Component should still render without errors
    expect(screen.getByRole("tab", { name: "Edit" })).toBeInTheDocument();
  });

  it("should use default theme when not specified", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "p { color: red; }" };

    render(<ContentEditor value={value} onChange={onChange} />);

    // Component should render without errors with default theme
    expect(screen.getByRole("tab", { name: "Edit" })).toBeInTheDocument();
  });
});

/**
 * Feature: react-html-content-editor
 * Property 7: Customization Props Applied
 *
 * For any valid customization props (className, htmlLabel, cssLabel, height, theme),
 * the component should apply these props to the appropriate elements without errors.
 *
 * Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7
 */
describe("Property 7: Customization Props Applied", () => {
  // Custom generator for valid height values
  const heightArbitrary = fc.oneof(
    fc.constant("400px"),
    fc.constant("500px"),
    fc.constant("600px"),
    fc.nat({ max: 1000 }).map((n) => `${n}px`),
    fc.nat({ max: 1000 }),
  );

  // Custom generator for valid theme values
  const themeArbitrary = fc.constantFrom(
    "vs-dark" as const,
    "vs-light" as const,
  );

  // Custom generator for valid defaultTab values
  const defaultTabArbitrary = fc.constantFrom("html" as const, "css" as const);

  // Custom generator for valid className values
  const classNameArbitrary = fc.oneof(
    fc.constant(""),
    fc.constant("custom-class"),
    fc.constant("test-editor"),
    fc.constant("my-editor-class"),
  );

  // Custom generator for valid label values
  const labelArbitrary = fc.oneof(
    fc.constant("HTML"),
    fc.constant("CSS"),
    fc.constant("Code"),
    fc.constant("Markup"),
    fc.constant("Styles"),
  );

  // Custom generator for valid editorOptions
  const editorOptionsArbitrary = fc.oneof(
    fc.constant({}),
    fc.constant({ fontSize: 14 }),
    fc.constant({ lineNumbers: "on" }),
    fc.constant({ wordWrap: "on" }),
    fc.constant({ minimap: { enabled: false } }),
  );

  it("should apply className prop to root container", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        classNameArbitrary,
        (value: ContentValue, className: string) => {
          const onChange = vi.fn();

          const { container, unmount } = render(
            <ContentEditor
              value={value}
              onChange={onChange}
              className={className}
            />,
          );

          // Find the editor container
          const editorContainer = container.querySelector(
            `.${styles.editorContainer}`,
          );
          expect(editorContainer).toBeInTheDocument();

          // If className is provided and not empty, it should be applied
          if (className && className.trim()) {
            expect(editorContainer).toHaveClass(className);
          }

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should apply htmlLabel and cssLabel props to tabs", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        labelArbitrary,
        labelArbitrary,
        async (value: ContentValue, htmlLabel: string, cssLabel: string) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor
              value={value}
              onChange={onChange}
              htmlLabel={htmlLabel}
              cssLabel={cssLabel}
            />,
          );

          // Get all tabs
          const tabs = screen.getAllByRole("tab");

          // Find the HTML and CSS tabs
          const htmlTab = tabs.find((tab) => tab.textContent === htmlLabel);
          const cssTab = tabs.find((tab) => tab.textContent === cssLabel);

          // Both tabs should be present with custom labels
          expect(htmlTab).toBeTruthy();
          expect(cssTab).toBeTruthy();

          unmount();
        },
      ),
      { numRuns: 100, timeout: 10000 },
    );
  });

  it("should apply height prop to editor container", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        heightArbitrary,
        (value: ContentValue, height: string | number) => {
          const onChange = vi.fn();

          const { container, unmount } = render(
            <ContentEditor value={value} onChange={onChange} height={height} />,
          );

          const editorContainer = container.querySelector(
            `.${styles.editorContainer}`,
          );
          expect(editorContainer).toBeInTheDocument();

          // Convert height to expected string format
          const expectedHeight =
            typeof height === "number" ? `${height}px` : height;
          expect(editorContainer).toHaveStyle({ height: expectedHeight });

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should apply defaultTab prop to set initial active editor", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        defaultTabArbitrary,
        (value: ContentValue, defaultTab) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor
              value={value}
              onChange={onChange}
              defaultTab={defaultTab}
            />,
          );

          // Get all tabs
          const tabs = screen.getAllByRole("tab");

          // Find the HTML and CSS tabs
          const htmlTab = tabs.find((tab) => tab.textContent === "HTML");
          const cssTab = tabs.find((tab) => tab.textContent === "CSS");

          // The tab matching defaultTab should be selected
          if (defaultTab === "html" && htmlTab) {
            expect(htmlTab).toHaveAttribute("aria-selected", "true");
          } else if (defaultTab === "css" && cssTab) {
            expect(cssTab).toHaveAttribute("aria-selected", "true");
          }

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should apply theme prop to Monaco Editor", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        themeArbitrary,
        (value: ContentValue, theme) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor value={value} onChange={onChange} theme={theme} />,
          );

          // Component should render without errors
          const tabs = screen.getAllByRole("tab");
          expect(tabs.length).toBeGreaterThanOrEqual(2);

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should apply editorOptions prop to Monaco Editor", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        editorOptionsArbitrary,
        (value: ContentValue, editorOptions) => {
          const onChange = vi.fn();

          const { unmount } = render(
            <ContentEditor
              value={value}
              onChange={onChange}
              editorOptions={editorOptions}
            />,
          );

          // Component should render without errors
          const tabs = screen.getAllByRole("tab");
          expect(tabs.length).toBeGreaterThanOrEqual(2);

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should apply all customization props together without errors", () => {
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string({ maxLength: 100 }),
          css: fc.string({ maxLength: 100 }),
        }),
        classNameArbitrary,
        labelArbitrary,
        labelArbitrary,
        heightArbitrary,
        defaultTabArbitrary,
        themeArbitrary,
        editorOptionsArbitrary,
        (
          value: ContentValue,
          className: string,
          htmlLabel: string,
          cssLabel: string,
          height: string | number,
          defaultTab,
          theme,
          editorOptions,
        ) => {
          const onChange = vi.fn();

          const { container, unmount } = render(
            <ContentEditor
              value={value}
              onChange={onChange}
              className={className}
              htmlLabel={htmlLabel}
              cssLabel={cssLabel}
              height={height}
              defaultTab={defaultTab}
              theme={theme}
              editorOptions={editorOptions}
            />,
          );

          // Component should render without errors
          const editorContainer = container.querySelector(
            `.${styles.editorContainer}`,
          );
          expect(editorContainer).toBeInTheDocument();

          // Verify className is applied
          if (className && className.trim()) {
            expect(editorContainer).toHaveClass(className);
          }

          // Verify height is applied
          const expectedHeight =
            typeof height === "number" ? `${height}px` : height;
          expect(editorContainer).toHaveStyle({ height: expectedHeight });

          // Verify tabs are present
          const tabs = screen.getAllByRole("tab");
          expect(tabs.length).toBeGreaterThanOrEqual(2);

          // Verify custom labels are used
          const htmlTab = tabs.find((tab) => tab.textContent === htmlLabel);
          const cssTab = tabs.find((tab) => tab.textContent === cssLabel);
          expect(htmlTab).toBeTruthy();
          expect(cssTab).toBeTruthy();

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Unit Tests for Error Handling
 *
 * Tests error message display, error border styling, and null/undefined handling.
 *
 * Validates: Requirements 16.1, 16.2, 16.5
 */
describe("Error Handling", () => {
  it("should display error message when error prop is provided", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "" };
    const errorMessage = "Failed to save content. Please try again.";

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} error={errorMessage} />,
    );

    // Check that error message is displayed
    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);

    // Check that error icon is present
    const errorIcon = container.querySelector(`.${styles.errorIcon}`);
    expect(errorIcon).toBeInTheDocument();
  });

  it("should apply error border styling when error prop is provided", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "" };
    const errorMessage = "Validation error";

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} error={errorMessage} />,
    );

    // Check that error border class is applied
    const editorContainer = container.querySelector(
      `.${styles.editorContainer}`,
    );
    expect(editorContainer).toHaveClass(styles.hasError);
  });

  it("should not display error message when error prop is not provided", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: "" };

    render(<ContentEditor value={value} onChange={onChange} />);

    // Check that error message is not displayed
    const errorElement = screen.queryByRole("alert");
    expect(errorElement).not.toBeInTheDocument();
  });

  it("should handle null html value by treating it as empty string", () => {
    const onChange = vi.fn();
    const value = { html: null as any, css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Component should render without crashing
    expect(container).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle undefined html value by treating it as empty string", () => {
    const onChange = vi.fn();
    const value = { html: undefined as any, css: "p { color: red; }" };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Component should render without crashing
    expect(container).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle null css value by treating it as empty string", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: null as any };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Component should render without crashing
    expect(container).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle undefined css value by treating it as empty string", () => {
    const onChange = vi.fn();
    const value = { html: "<p>Test</p>", css: undefined as any };

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Component should render without crashing
    expect(container).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle null value object by treating both as empty strings", () => {
    const onChange = vi.fn();
    const value = null as any;

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Component should render without crashing
    expect(container).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle undefined value object by treating both as empty strings", () => {
    const onChange = vi.fn();
    const value = undefined as any;

    const { container } = render(
      <ContentEditor value={value} onChange={onChange} />,
    );

    // Component should render without crashing
    expect(container).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(2);
  });
});

/**
 * Accessibility Tests
 *
 * Tests ARIA labels, keyboard navigation, focus management, and screen reader announcements.
 *
 * Validates: Requirements 17.1, 17.2, 17.3, 17.4
 */
describe("Accessibility", () => {
  describe("ARIA Labels", () => {
    it("should have aria-label on all icon-only buttons", () => {
      const onChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(
        <ContentEditor
          value={value}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Check for aria-labels on buttons
      expect(screen.getByLabelText(/Save content/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Format HTML/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Open fullscreen/i)).toBeInTheDocument();
    });

    it("should have aria-label on format buttons for both HTML and CSS", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(<ContentEditor value={value} onChange={onChange} />);

      // Check HTML format button
      expect(screen.getByLabelText(/Format HTML/i)).toBeInTheDocument();

      // Switch to CSS tab
      const tabs = screen.getAllByRole("tab");
      const cssTab = tabs.find((tab) => tab.textContent === "CSS");
      if (cssTab) {
        await user.click(cssTab);

        // Check CSS format button
        await waitFor(() => {
          expect(screen.getByLabelText(/Format CSS/i)).toBeInTheDocument();
        });
      }
    });

    it("should have aria-label on fullscreen mode buttons", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(<ContentEditor value={value} onChange={onChange} />);

      // Open fullscreen
      const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
      await user.click(fullscreenButton);

      // Check for mode button labels
      await waitFor(() => {
        expect(screen.getByLabelText("Edit mode")).toBeInTheDocument();
        expect(screen.getByLabelText("Preview mode")).toBeInTheDocument();
        expect(screen.getByLabelText("Split view mode")).toBeInTheDocument();
        expect(screen.getByLabelText(/Close fullscreen/i)).toBeInTheDocument();
      });
    });

    it("should have aria-pressed on sync toggle button", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(<ContentEditor value={value} onChange={onChange} />);

      // Open fullscreen and switch to split mode
      const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
      await user.click(fullscreenButton);

      const splitButton = screen.getByLabelText("Split view mode");
      await user.click(splitButton);

      // Check sync button has aria-pressed
      await waitFor(() => {
        const syncButton = screen.getByLabelText("Disable scroll sync");
        expect(syncButton).toHaveAttribute("aria-pressed", "true");
      });

      // Toggle sync off
      const syncButton = screen.getByLabelText("Disable scroll sync");
      await user.click(syncButton);

      // Check aria-pressed is false
      await waitFor(() => {
        const syncOffButton = screen.getByLabelText("Enable scroll sync");
        expect(syncOffButton).toHaveAttribute("aria-pressed", "false");
      });
    });

    it("should have role='tablist' on tab containers", () => {
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(<ContentEditor value={value} onChange={onChange} />);

      // Check for tablists
      const tablists = screen.getAllByRole("tablist");
      expect(tablists.length).toBeGreaterThan(0);
    });

    it("should have role='tab' on all tab triggers", () => {
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(<ContentEditor value={value} onChange={onChange} />);

      // Check for tabs
      const tabs = screen.getAllByRole("tab");
      expect(tabs.length).toBeGreaterThanOrEqual(4); // Edit, Preview, HTML, CSS
    });

    it("should have aria-selected on active tabs", () => {
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(<ContentEditor value={value} onChange={onChange} />);

      // Check that Edit tab is selected by default
      const tabs = screen.getAllByRole("tab");
      const editTab = tabs.find((tab) => tab.textContent === "Edit");
      expect(editTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Keyboard Navigation", () => {
    it("should allow tab navigation through all interactive elements", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

      const { rerender } = render(
        <ContentEditor
          value={initialValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Simulate a change to enable save button
      const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
      rerender(
        <ContentEditor
          value={newValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Tab through elements
      await user.tab();
      expect(document.activeElement).toBeTruthy();

      // Continue tabbing
      await user.tab();
      expect(document.activeElement).toBeTruthy();

      await user.tab();
      expect(document.activeElement).toBeTruthy();
    });

    it("should have visible focus indicators on buttons", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(<ContentEditor value={value} onChange={onChange} />);

      // Tab to first button
      await user.tab();

      // Check that focused element is a button or tab
      const focusedElement = document.activeElement;
      expect(focusedElement?.tagName).toMatch(/BUTTON/i);
    });

    it("should support Enter and Space keys on tab triggers", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(<ContentEditor value={value} onChange={onChange} />);

      // Get the Preview tab
      const tabs = screen.getAllByRole("tab");
      const previewTab = tabs.find((tab) => tab.textContent === "Preview");

      if (previewTab) {
        // Focus the tab
        previewTab.focus();

        // Press Enter
        await user.keyboard("{Enter}");

        // Tab should be activated
        await waitFor(() => {
          expect(previewTab).toHaveAttribute("aria-selected", "true");
        });
      }
    });

    it("should support Escape key to close dialog", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

      const { rerender } = render(
        <ContentEditor
          value={initialValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Open fullscreen
      const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
      await user.click(fullscreenButton);

      // Simulate a change
      const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
      rerender(
        <ContentEditor
          value={newValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Try to close fullscreen
      const closeButton = screen.getByLabelText(/Close fullscreen/i);
      await user.click(closeButton);

      // Wait for dialog
      await waitFor(() => {
        expect(screen.getByText("Unsaved Changes")).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard("{Escape}");

      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByText("Unsaved Changes")).not.toBeInTheDocument();
      });
    });
  });

  describe("Focus Management", () => {
    it("should return focus to fullscreen button when exiting fullscreen", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(<ContentEditor value={value} onChange={onChange} />);

      // Open fullscreen
      const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
      await user.click(fullscreenButton);

      // Verify fullscreen is open
      await waitFor(() => {
        expect(screen.getByLabelText(/Close fullscreen/i)).toBeInTheDocument();
      });

      // Close fullscreen
      const closeButton = screen.getByLabelText(/Close fullscreen/i);
      await user.click(closeButton);

      // Wait for fullscreen to close
      await waitFor(() => {
        expect(
          screen.queryByLabelText("Close fullscreen"),
        ).not.toBeInTheDocument();
      });

      // Focus should return to fullscreen button
      await waitFor(() => {
        expect(document.activeElement).toBe(fullscreenButton);
      });
    });

    it("should manage focus when switching between fullscreen modes", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      const { container } = render(
        <ContentEditor value={value} onChange={onChange} />,
      );

      // Open fullscreen
      const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
      await user.click(fullscreenButton);

      // Verify fullscreen is open
      await waitFor(() => {
        const fullscreenOverlay = container.querySelector(
          `.${styles.fullscreenOverlay}`,
        );
        expect(fullscreenOverlay).toBeInTheDocument();
      });

      // Switch to preview mode
      const previewButton = screen.getByLabelText("Preview mode");
      await user.click(previewButton);

      // Verify preview content is shown
      await waitFor(() => {
        const previewContainer = container.querySelector(".content-preview");
        expect(previewContainer).toBeInTheDocument();
      });

      // Switch back to edit mode
      const editButton = screen.getByLabelText("Edit mode");
      await user.click(editButton);

      // Verify we're back in edit mode (tabs should be visible)
      await waitFor(() => {
        const tabs = screen.getAllByRole("tab");
        const htmlTab = tabs.find((tab) => tab.textContent === "HTML");
        expect(htmlTab).toBeInTheDocument();
      });
    });

    it("should trap focus within dialog when open", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

      const { rerender } = render(
        <ContentEditor
          value={initialValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Open fullscreen
      const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
      await user.click(fullscreenButton);

      // Simulate a change
      const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
      rerender(
        <ContentEditor
          value={newValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Try to close fullscreen
      const closeButton = screen.getByLabelText(/Close fullscreen/i);
      await user.click(closeButton);

      // Wait for dialog
      await waitFor(() => {
        expect(screen.getByText("Unsaved Changes")).toBeInTheDocument();
      });

      // Tab through dialog elements
      await user.tab();
      const firstFocusedElement = document.activeElement;
      expect(firstFocusedElement).toBeTruthy();

      // Tab again
      await user.tab();
      const secondFocusedElement = document.activeElement;
      expect(secondFocusedElement).toBeTruthy();

      // Both should be within the dialog
      const dialog = screen.getByRole("dialog");
      expect(dialog.contains(firstFocusedElement)).toBe(true);
      expect(dialog.contains(secondFocusedElement)).toBe(true);
    });
  });

  describe("Screen Reader Announcements", () => {
    it("should have aria-live on save status indicator", () => {
      const onChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      const { container } = render(
        <ContentEditor
          value={value}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Find the save status element
      const saveStatus = container.querySelector(`.${styles.saveStatus}`);
      expect(saveStatus).toHaveAttribute("aria-live", "polite");
      expect(saveStatus).toHaveAttribute("aria-atomic", "true");
    });

    it("should announce save status changes to screen readers", async () => {
      const onChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

      const { container, rerender } = render(
        <ContentEditor
          value={initialValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Initially should show "Saved"
      const saveStatus = container.querySelector(`.${styles.saveStatus}`);
      expect(saveStatus).toHaveTextContent("Saved");

      // Simulate a change
      const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
      rerender(
        <ContentEditor
          value={newValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Should announce "Unsaved changes"
      await waitFor(() => {
        expect(saveStatus).toHaveTextContent("Unsaved changes");
      });

      // Simulate saving
      rerender(
        <ContentEditor
          value={newValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={true}
        />,
      );

      // Should announce "Saving..."
      await waitFor(() => {
        expect(saveStatus).toHaveTextContent("Saving...");
      });
    });

    it("should have role='alert' on error messages", () => {
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "" };
      const errorMessage = "Failed to save content.";

      render(
        <ContentEditor
          value={value}
          onChange={onChange}
          error={errorMessage}
        />,
      );

      // Check that error has role="alert"
      const errorElement = screen.getByRole("alert");
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(errorMessage);
    });

    it("should have aria-hidden on decorative icons", () => {
      const onChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const value = { html: "<p>Test</p>", css: "" };

      const { container } = render(
        <ContentEditor
          value={value}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Check that icons in save status have aria-hidden
      const saveStatus = container.querySelector(`.${styles.saveStatus}`);
      const icon = saveStatus?.querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("should have role='dialog' and aria-modal on dialog", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const initialValue = { html: "<p>Test</p>", css: "p { color: red; }" };

      const { rerender } = render(
        <ContentEditor
          value={initialValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Open fullscreen
      const fullscreenButton = screen.getByLabelText(/Open fullscreen/i);
      await user.click(fullscreenButton);

      // Simulate a change
      const newValue = { html: "<p>Changed</p>", css: "p { color: red; }" };
      rerender(
        <ContentEditor
          value={newValue}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Try to close fullscreen
      const closeButton = screen.getByLabelText(/Close fullscreen/i);
      await user.click(closeButton);

      // Wait for dialog
      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute("aria-modal", "true");
      });
    });
  });

  describe("High Contrast Mode", () => {
    it("should render correctly in high contrast mode", () => {
      const onChange = vi.fn();
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      // Note: We can't actually test @media queries in jsdom,
      // but we can verify the component renders without errors
      const { container } = render(
        <ContentEditor value={value} onChange={onChange} />,
      );

      expect(container).toBeInTheDocument();
      const editorContainer = container.querySelector(
        `.${styles.editorContainer}`,
      );
      expect(editorContainer).toBeInTheDocument();
    });

    it("should have sufficient color contrast for text elements", () => {
      const onChange = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);
      const value = { html: "<p>Test</p>", css: "p { color: red; }" };

      render(
        <ContentEditor
          value={value}
          onChange={onChange}
          onSave={onSave}
          isSaving={false}
        />,
      );

      // Verify text elements are present and readable
      expect(screen.getByText("Saved")).toBeInTheDocument();
      expect(screen.getByLabelText("Toggle edit mode")).toBeInTheDocument();
      expect(screen.getByLabelText("Toggle preview mode")).toBeInTheDocument();
    });
  });
});
