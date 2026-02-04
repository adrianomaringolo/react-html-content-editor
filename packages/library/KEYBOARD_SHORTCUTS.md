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

These shortcuts are provided by Monaco Editor and work when the editor has focus:

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

- **Format Code** (`Ctrl/⌘ + Shift + F`): Formats the currently active editor (HTML or CSS) with proper indentation and structure
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
- Access Monaco Editor's command palette with `F1` for additional commands
