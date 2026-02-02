import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

describe("Tabs", () => {
  describe("Tab switching", () => {
    it("should switch tabs when clicking on triggers", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      // Initially, tab1 should be active
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument();

      // Click on tab2
      const tab2Trigger = screen.getByRole("tab", { name: /tab 2/i });
      await user.click(tab2Trigger);

      // Now tab2 content should be visible
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("should update aria-selected when switching tabs", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      const tab1 = screen.getByRole("tab", { name: /tab 1/i });
      const tab2 = screen.getByRole("tab", { name: /tab 2/i });

      // Initially, tab1 should be selected
      expect(tab1).toHaveAttribute("aria-selected", "true");
      expect(tab2).toHaveAttribute("aria-selected", "false");

      // Click on tab2
      await user.click(tab2);

      // Now tab2 should be selected
      expect(tab1).toHaveAttribute("aria-selected", "false");
      expect(tab2).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Controlled vs uncontrolled mode", () => {
    it("should work in uncontrolled mode with defaultValue", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      // Initially shows tab1 content
      expect(screen.getByText("Content 1")).toBeInTheDocument();

      // Switch to tab2
      await user.click(screen.getByRole("tab", { name: /tab 2/i }));

      // Now shows tab2 content
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("should work in controlled mode with value prop", async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <Tabs value='tab1' onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      // Initially shows tab1 content
      expect(screen.getByText("Content 1")).toBeInTheDocument();

      // Click on tab2
      await user.click(screen.getByRole("tab", { name: /tab 2/i }));

      // onValueChange should be called
      expect(handleValueChange).toHaveBeenCalledWith("tab2");

      // Rerender with new value (simulating parent state update)
      rerender(
        <Tabs value='tab2' onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      // Now shows tab2 content
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("should call onValueChange in uncontrolled mode", async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Tabs defaultValue='tab1' onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      // Click on tab2
      await user.click(screen.getByRole("tab", { name: /tab 2/i }));

      // onValueChange should be called even in uncontrolled mode
      expect(handleValueChange).toHaveBeenCalledWith("tab2");
    });
  });

  describe("Keyboard navigation", () => {
    it("should activate tab on Enter key", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      tab2.focus();

      // Press Enter
      await user.keyboard("{Enter}");

      // Tab2 content should be visible
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("should activate tab on Space key", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      tab2.focus();

      // Press Space
      await user.keyboard(" ");

      // Tab2 content should be visible
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("should not activate disabled tab on keyboard", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2' disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      tab2.focus();

      // Press Enter
      await user.keyboard("{Enter}");

      // Tab1 content should still be visible
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    });
  });

  describe("ARIA attributes", () => {
    it("should have proper role attributes", () => {
      render(
        <Tabs defaultValue='tab1'>
          <TabsList aria-label='Main tabs'>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      // TabsList should have role="tablist"
      const tablist = screen.getByRole("tablist");
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute("aria-label", "Main tabs");

      // TabsTrigger should have role="tab"
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(2);

      // TabsContent should have role="tabpanel"
      const tabpanel = screen.getByRole("tabpanel");
      expect(tabpanel).toBeInTheDocument();
    });

    it("should have proper aria-selected attributes", () => {
      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      const tab1 = screen.getByRole("tab", { name: /tab 1/i });
      const tab2 = screen.getByRole("tab", { name: /tab 2/i });

      expect(tab1).toHaveAttribute("aria-selected", "true");
      expect(tab2).toHaveAttribute("aria-selected", "false");
    });

    it("should have proper aria-controls and id relationships", () => {
      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
        </Tabs>,
      );

      const tab = screen.getByRole("tab", { name: /tab 1/i });
      const tabpanel = screen.getByRole("tabpanel");

      // Tab should have aria-controls pointing to tabpanel
      expect(tab).toHaveAttribute("aria-controls", "tabpanel-tab1");
      expect(tab).toHaveAttribute("id", "tab-tab1");

      // Tabpanel should have aria-labelledby pointing to tab
      expect(tabpanel).toHaveAttribute("aria-labelledby", "tab-tab1");
      expect(tabpanel).toHaveAttribute("id", "tabpanel-tab1");
    });

    it("should have proper tabIndex for keyboard navigation", () => {
      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      const tab1 = screen.getByRole("tab", { name: /tab 1/i });
      const tab2 = screen.getByRole("tab", { name: /tab 2/i });

      // Active tab should have tabIndex 0
      expect(tab1).toHaveAttribute("tabIndex", "0");

      // Inactive tab should have tabIndex -1
      expect(tab2).toHaveAttribute("tabIndex", "-1");
    });

    it("should have tabIndex 0 on tabpanel for accessibility", () => {
      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
        </Tabs>,
      );

      const tabpanel = screen.getByRole("tabpanel");
      expect(tabpanel).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Disabled state", () => {
    it("should not switch to disabled tab on click", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2' disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      await user.click(tab2);

      // Should still show tab1 content
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    });

    it("should have disabled attribute on disabled trigger", () => {
      render(
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2' disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </Tabs>,
      );

      const tab2 = screen.getByRole("tab", { name: /tab 2/i });
      expect(tab2).toBeDisabled();
    });
  });

  describe("Error handling", () => {
    it("should throw error when TabsTrigger is used outside Tabs", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<TabsTrigger value='tab1'>Tab 1</TabsTrigger>);
      }).toThrow("Tabs compound components must be used within Tabs");

      console.error = originalError;
    });

    it("should throw error when TabsContent is used outside Tabs", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<TabsContent value='tab1'>Content 1</TabsContent>);
      }).toThrow("Tabs compound components must be used within Tabs");

      console.error = originalError;
    });
  });
});
