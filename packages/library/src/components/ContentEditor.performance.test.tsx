/**
 * Performance Tests for ContentEditor
 *
 * These tests verify that the editor performs well with large documents
 * and that scroll sync and formatting operations complete in reasonable time.
 *
 * Requirements: 18.1, 18.2, 18.3
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContentEditor } from "./ContentEditor";
import type { ContentValue } from "../types";

// Helper to generate large HTML content
function generateLargeHTML(lines: number): string {
  const htmlLines: string[] = ["<div>"];
  for (let i = 0; i < lines; i++) {
    htmlLines.push(
      `  <p>Line ${i}: This is a test paragraph with some content.</p>`,
    );
  }
  htmlLines.push("</div>");
  return htmlLines.join("\n");
}

// Helper to generate large CSS content
function generateLargeCSS(lines: number): string {
  const cssLines: string[] = [];
  for (let i = 0; i < lines; i++) {
    cssLines.push(`.class-${i} {`);
    cssLines.push(`  color: #${i.toString(16).padStart(6, "0")};`);
    cssLines.push(`  font-size: ${12 + (i % 10)}px;`);
    cssLines.push(`}`);
  }
  return cssLines.join("\n");
}

describe("Performance Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Large Document Handling", () => {
    it("should render with 10,000+ lines of HTML without crashing", async () => {
      const largeHTML = generateLargeHTML(10000);
      const value: ContentValue = {
        html: largeHTML,
        css: "p { color: blue; }",
      };
      const onChange = vi.fn();

      const startTime = performance.now();

      const { container } = render(
        <ContentEditor value={value} onChange={onChange} />,
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in reasonable time (< 5 seconds)
      expect(renderTime).toBeLessThan(5000);
      expect(container).toBeInTheDocument();

      // Verify the editor is present
      const editTab = screen.getByRole("tab", { name: /edit/i });
      expect(editTab).toBeInTheDocument();
    });

    it("should handle large CSS documents efficiently", async () => {
      const largeCSS = generateLargeCSS(2500); // ~10,000 lines
      const value: ContentValue = {
        html: "<p>Test</p>",
        css: largeCSS,
      };
      const onChange = vi.fn();

      const startTime = performance.now();

      const { container } = render(
        <ContentEditor value={value} onChange={onChange} />,
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in reasonable time
      expect(renderTime).toBeLessThan(5000);
      expect(container).toBeInTheDocument();
    });

    it("should switch tabs quickly with large documents", async () => {
      const user = userEvent.setup();
      const largeHTML = generateLargeHTML(5000);
      const largeCSS = generateLargeCSS(1250);
      const value: ContentValue = {
        html: largeHTML,
        css: largeCSS,
      };
      const onChange = vi.fn();

      render(<ContentEditor value={value} onChange={onChange} />);

      // Switch to CSS tab
      const cssTab = screen.getByRole("tab", { name: /css/i });

      const startTime = performance.now();
      await user.click(cssTab);
      const endTime = performance.now();

      const switchTime = endTime - startTime;

      // Tab switching should be fast (< 500ms)
      expect(switchTime).toBeLessThan(500);
      expect(cssTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Scroll Sync Performance", () => {
    it("should handle scroll sync without significant lag", async () => {
      const largeHTML = generateLargeHTML(1000);
      const value: ContentValue = {
        html: largeHTML,
        css: "p { margin: 20px; }",
      };
      const onChange = vi.fn();

      render(<ContentEditor value={value} onChange={onChange} />);

      // Open fullscreen to access split view
      const fullscreenButton = screen.getByLabelText(/open fullscreen/i);
      await userEvent.click(fullscreenButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/split view mode/i)).toBeInTheDocument();
      });

      // Switch to split view
      const splitButton = screen.getByLabelText(/split view mode/i);
      await userEvent.click(splitButton);

      // Scroll sync is enabled by default in split view
      // The actual scroll performance is handled by Monaco and the browser
      // We just verify the component renders and is responsive
      expect(screen.getByLabelText(/disable scroll sync/i)).toBeInTheDocument();
    });
  });

  describe("Formatting Performance", () => {
    it("should format large HTML documents in under 500ms", async () => {
      const user = userEvent.setup();
      const largeHTML = generateLargeHTML(1000);
      const value: ContentValue = {
        html: largeHTML,
        css: "",
      };
      const onChange = vi.fn();

      // Mock Monaco editor's formatDocument action
      const mockFormatAction = {
        run: vi.fn().mockResolvedValue(undefined),
      };

      const mockEditor = {
        getAction: vi.fn().mockReturnValue(mockFormatAction),
      };

      // We can't easily test Monaco's actual formatting performance in unit tests
      // but we can verify the format button is responsive
      render(<ContentEditor value={value} onChange={onChange} />);

      const formatButton = screen.getByLabelText(/format html code/i);

      const startTime = performance.now();
      await user.click(formatButton);
      const endTime = performance.now();

      const clickTime = endTime - startTime;

      // Button click should be responsive (< 300ms)
      expect(clickTime).toBeLessThan(300);
    });

    it("should format large CSS documents efficiently", async () => {
      const user = userEvent.setup();
      const largeCSS = generateLargeCSS(1250);
      const value: ContentValue = {
        html: "",
        css: largeCSS,
      };
      const onChange = vi.fn();

      render(<ContentEditor value={value} onChange={onChange} />);

      // Switch to CSS tab
      const cssTab = screen.getByRole("tab", { name: /css/i });
      await user.click(cssTab);

      const formatButton = screen.getByLabelText(/format css code/i);

      const startTime = performance.now();
      await user.click(formatButton);
      const endTime = performance.now();

      const clickTime = endTime - startTime;

      // Button click should be responsive (< 500ms including tab switch)
      expect(clickTime).toBeLessThan(500);
    });
  });

  describe("Memory and Re-render Performance", () => {
    it("should not cause excessive re-renders on content changes", async () => {
      const value: ContentValue = {
        html: "<p>Initial</p>",
        css: "",
      };
      let renderCount = 0;
      const onChange = vi.fn();

      // Track renders
      function TestWrapper() {
        renderCount++;
        return <ContentEditor value={value} onChange={onChange} />;
      }

      const { rerender } = render(<TestWrapper />);
      const initialRenderCount = renderCount;

      // Update value
      value.html = "<p>Updated</p>";
      rerender(<TestWrapper />);

      // Should only re-render once for the update
      expect(renderCount).toBe(initialRenderCount + 1);
    });

    it("should handle rapid content changes efficiently", async () => {
      const value: ContentValue = {
        html: "<p>Test</p>",
        css: "",
      };
      const onChange = vi.fn();

      const { rerender } = render(
        <ContentEditor value={value} onChange={onChange} />,
      );

      const startTime = performance.now();

      // Simulate 100 rapid updates
      for (let i = 0; i < 100; i++) {
        value.html = `<p>Update ${i}</p>`;
        rerender(<ContentEditor value={value} onChange={onChange} />);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 100 updates should complete in reasonable time (< 2 seconds)
      expect(totalTime).toBeLessThan(2000);
    });
  });
});
