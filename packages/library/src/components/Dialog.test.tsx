import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./Dialog";
import { Button } from "./Button";

describe("Dialog", () => {
  describe("Open/close behavior", () => {
    it("should not render content when closed", () => {
      render(
        <Dialog open={false}>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should render content when open", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should open dialog when trigger is clicked", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Dialog should not be visible initially
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Click the trigger
      const trigger = screen.getByRole("button", { name: /open dialog/i });
      await user.click(trigger);

      // Dialog should now be visible
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should call onOpenChange when dialog opens", async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog onOpenChange={handleOpenChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole("button", { name: /open dialog/i });
      await user.click(trigger);

      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it("should work in controlled mode", async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <Dialog open={false} onOpenChange={handleOpenChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Dialog should not be visible
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Click trigger
      const trigger = screen.getByRole("button", { name: /open dialog/i });
      await user.click(trigger);

      // onOpenChange should be called
      expect(handleOpenChange).toHaveBeenCalledWith(true);

      // Rerender with open=true
      rerender(
        <Dialog open={true} onOpenChange={handleOpenChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Dialog should now be visible
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should work in uncontrolled mode with defaultOpen", () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Dialog should be visible initially
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("Focus trap", () => {
    it("should focus first focusable element when dialog opens", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
            <Button>First Button</Button>
            <Button>Second Button</Button>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole("button", { name: /open dialog/i });
      await user.click(trigger);

      await waitFor(() => {
        const firstButton = screen.getByRole("button", {
          name: /first button/i,
        });
        expect(firstButton).toHaveFocus();
      });
    });

    it("should trap focus within dialog when tabbing forward", async () => {
      const user = userEvent.setup();

      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
            <Button>First Button</Button>
            <Button>Second Button</Button>
          </DialogContent>
        </Dialog>,
      );

      const firstButton = screen.getByRole("button", { name: /first button/i });
      const secondButton = screen.getByRole("button", {
        name: /second button/i,
      });

      // Focus first button
      firstButton.focus();
      expect(firstButton).toHaveFocus();

      // Tab to second button
      await user.tab();
      expect(secondButton).toHaveFocus();

      // Tab again should wrap to first button
      await user.tab();
      expect(firstButton).toHaveFocus();
    });

    it("should trap focus within dialog when tabbing backward", async () => {
      const user = userEvent.setup();

      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
            <Button>First Button</Button>
            <Button>Second Button</Button>
          </DialogContent>
        </Dialog>,
      );

      const firstButton = screen.getByRole("button", { name: /first button/i });
      const secondButton = screen.getByRole("button", {
        name: /second button/i,
      });

      // Focus first button
      firstButton.focus();
      expect(firstButton).toHaveFocus();

      // Shift+Tab should wrap to last button
      await user.tab({ shift: true });
      expect(secondButton).toHaveFocus();
    });

    it("should restore focus to trigger when dialog closes", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
            <Button
              onClick={() => {
                // This will be handled by the test
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole("button", { name: /open dialog/i });
      await user.click(trigger);

      // Dialog should be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Press Escape to close
      await user.keyboard("{Escape}");

      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Focus should be restored to trigger
      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });
  });

  describe("Escape key", () => {
    it("should close dialog when Escape key is pressed", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Open dialog
      const trigger = screen.getByRole("button", { name: /open dialog/i });
      await user.click(trigger);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Press Escape
      await user.keyboard("{Escape}");

      // Dialog should be closed
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should call onOpenChange with false when Escape is pressed", async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog open={true} onOpenChange={handleOpenChange}>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Press Escape
      await user.keyboard("{Escape}");

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it("should call onEscapeKeyDown callback when provided", async () => {
      const handleEscapeKeyDown = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog open={true}>
          <DialogContent onEscapeKeyDown={handleEscapeKeyDown}>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Press Escape
      await user.keyboard("{Escape}");

      expect(handleEscapeKeyDown).toHaveBeenCalled();
    });

    it("should not close dialog if onEscapeKeyDown prevents default", async () => {
      const handleEscapeKeyDown = vi.fn((e: KeyboardEvent) => {
        e.preventDefault();
      });
      const user = userEvent.setup();

      render(
        <Dialog open={true}>
          <DialogContent onEscapeKeyDown={handleEscapeKeyDown}>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Press Escape
      await user.keyboard("{Escape}");

      expect(handleEscapeKeyDown).toHaveBeenCalled();

      // Dialog should still be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("Click outside to close", () => {
    it("should close dialog when clicking outside content", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Open dialog
      const trigger = screen.getByRole("button", { name: /open dialog/i });
      await user.click(trigger);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click on the overlay (outside the dialog content)
      const overlay = screen.getByRole("presentation");
      await user.click(overlay);

      // Dialog should be closed
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should not close dialog when clicking inside content", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
            <p>Dialog content</p>
          </DialogContent>
        </Dialog>,
      );

      // Open dialog
      const trigger = screen.getByRole("button", { name: /open dialog/i });
      await user.click(trigger);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click inside the dialog content
      const content = screen.getByText(/dialog content/i);
      await user.click(content);

      // Dialog should still be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should call onPointerDownOutside callback when provided", async () => {
      const handlePointerDownOutside = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog open={true}>
          <DialogContent onPointerDownOutside={handlePointerDownOutside}>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Click outside
      const overlay = screen.getByRole("presentation");
      await user.click(overlay);

      expect(handlePointerDownOutside).toHaveBeenCalled();
    });

    it("should not close dialog if onPointerDownOutside prevents default", async () => {
      const handlePointerDownOutside = vi.fn((e: PointerEvent) => {
        e.preventDefault();
      });
      const user = userEvent.setup();

      render(
        <Dialog open={true}>
          <DialogContent onPointerDownOutside={handlePointerDownOutside}>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      // Click outside
      const overlay = screen.getByRole("presentation");
      await user.click(overlay);

      expect(handlePointerDownOutside).toHaveBeenCalled();

      // Dialog should still be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("should render with DialogHeader, DialogTitle, DialogDescription, and DialogFooter", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Title</DialogTitle>
              <DialogDescription>Test Description</DialogDescription>
            </DialogHeader>
            <p>Dialog body content</p>
            <DialogFooter>
              <Button>Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
      expect(screen.getByText("Dialog body content")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /confirm/i }),
      ).toBeInTheDocument();
    });

    it("should prevent body scroll when dialog is open", () => {
      const { unmount } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(document.body.style.overflow).toBe("hidden");

      unmount();

      expect(document.body.style.overflow).toBe("");
    });

    it("should render dialog content in a portal", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog.parentElement?.parentElement).toBe(document.body);
    });
  });

  describe("DialogTrigger with asChild", () => {
    it("should work with asChild prop", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Custom Trigger</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole("button", { name: /custom trigger/i });
      await user.click(trigger);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("should throw error when DialogTrigger is used outside Dialog", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<DialogTrigger>Open</DialogTrigger>);
      }).toThrow("Dialog compound components must be used within Dialog");

      console.error = originalError;
    });

    it("should throw error when DialogContent is used outside Dialog", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
          </DialogContent>,
        );
      }).toThrow("Dialog compound components must be used within Dialog");

      console.error = originalError;
    });
  });
});
