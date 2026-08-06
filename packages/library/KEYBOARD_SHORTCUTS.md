# Keyboard Shortcuts

The React HTML Content Editor includes several keyboard shortcuts to improve productivity.

## Global Shortcuts

These shortcuts work anywhere in the editor:

| Action                | Windows/Linux      | macOS       |
| --------------------- | ------------------ | ----------- |
| **Save**              | `Ctrl + S`         | `⌘ + S`     |
| **Format Code**       | `Ctrl + Shift + F` | `⌘ + ⇧ + F` |
| **Toggle Fullscreen** | `Ctrl + Shift + M` | `⌘ + ⇧ + M` |
| **Exit Fullscreen**   | `Esc`              | `Esc`       |

## Editor Shortcuts

These shortcuts come from the code editor and work when it has focus. The table
below describes `MonacoCodeEditor` (see the README on enabling Monaco). The
built-in textarea editor supports the subset the browser provides — Undo/Redo,
Select All, Home/End and word-wise motion — plus `Tab` / `Shift + Tab` to indent
and outdent the selection:

| Action                     | Windows/Linux                    | macOS       |
| -------------------------- | -------------------------------- | ----------- |
| **Undo**                   | `Ctrl + Z`                       | `⌘ + Z`     |
| **Redo**                   | `Ctrl + Shift + Z` or `Ctrl + Y` | `⌘ + ⇧ + Z` |
| **Find**                   | `Ctrl + F`                       | `⌘ + F`     |
| **Replace**                | `Ctrl + H`                       | `⌘ + H`     |
| **Select All**             | `Ctrl + A`                       | `⌘ + A`     |
| **Cut**                    | `Ctrl + X`                       | `⌘ + X`     |
| **Copy**                   | `Ctrl + C`                       | `⌘ + C`     |
| **Paste**                  | `Ctrl + V`                       | `⌘ + V`     |
| **Comment/Uncomment**      | `Ctrl + /`                       | `⌘ + /`     |
| **Indent**                 | `Tab`                            | `Tab`       |
| **Outdent**                | `Shift + Tab`                    | `⇧ + Tab`   |
| **Move Line Up**           | `Alt + ↑`                        | `⌥ + ↑`     |
| **Move Line Down**         | `Alt + ↓`                        | `⌥ + ↓`     |
| **Copy Line Up**           | `Shift + Alt + ↑`                | `⇧ + ⌥ + ↑` |
| **Copy Line Down**         | `Shift + Alt + ↓`                | `⇧ + ⌥ + ↓` |
| **Delete Line**            | `Ctrl + Shift + K`               | `⌘ + ⇧ + K` |
| **Multi-cursor**           | `Alt + Click`                    | `⌥ + Click` |
| **Select Next Occurrence** | `Ctrl + D`                       | `⌘ + D`     |
| **Select All Occurrences** | `Ctrl + Shift + L`               | `⌘ + ⇧ + L` |

## Notes

- **Format Code** (`Ctrl/⌘ + Shift + F`): Formats the currently active editor (HTML or CSS) with proper indentation and structure. Requires a code editor that can format, such as `MonacoCodeEditor`; with the built-in textarea editor the shortcut and its toolbar button are inactive
- **Save** (`Ctrl/⌘ + S`): Only works if the `onSave` prop is provided and there are unsaved changes
- **Toggle Fullscreen** (`Ctrl/⌘ + Shift + M`): Opens or closes the fullscreen editor mode
- **Exit Fullscreen** (`Esc`): Closes fullscreen mode (will prompt if there are unsaved changes)

## Accessibility

All toolbar buttons include:

- Descriptive `aria-label` attributes
- Keyboard shortcut hints in tooltips
- Full keyboard navigation support
- Screen reader announcements for state changes

## Customization

The keyboard shortcuts are built into the component and cannot be customized. However, you can:

- Disable auto-save to control when saves happen
- Use the `onSave` callback to implement your own save logic
- Access Monaco's command palette with `F1` for additional commands (when using `MonacoCodeEditor`)
