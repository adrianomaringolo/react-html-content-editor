# React HTML Content Editor - Demo Application

This is the demo application for the React HTML Content Editor library. It showcases all the features and provides examples of how to use the component.

## Development Workflow

### Making Changes to the Library

When developing the library locally, follow these steps to test your changes in the demo app:

#### 1. Make Changes to the Library

Edit files in `packages/library/src/`:

```bash
cd packages/library
# Edit your files...
```

#### 2. Build the Library

After making changes, rebuild the library:

```bash
cd packages/library
pnpm run build
```

This will:

- Compile TypeScript files
- Bundle the library with Vite
- Generate type declarations
- Output to `packages/library/dist/`

#### 3. Run the Demo App

The demo app is configured to use the local library via workspace dependencies. Start the dev server:

```bash
cd packages/demo
pnpm run dev
```

The demo will be available at `http://localhost:3000` (or another port if 3000 is in use).

#### 4. See Your Changes

The demo app automatically imports from the local library build. After rebuilding the library, refresh your browser to see the changes.

### Quick Development Loop

For rapid development, you can use two terminal windows:

**Terminal 1 - Library (watch mode):**

```bash
cd packages/library
pnpm run build --watch
```

**Terminal 2 - Demo app:**

```bash
cd packages/demo
pnpm run dev
```

This way, the library rebuilds automatically when you save changes, and you just need to refresh the browser.

### Running Tests

Test the library before committing changes:

```bash
cd packages/library
pnpm run test
```

### Project Structure

```
packages/
├── library/           # The main library package
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   └── types/       # TypeScript types
│   └── dist/          # Built library (generated)
│
└── demo/              # Demo application
    ├── src/
    │   ├── examples/  # Example components
    │   ├── editors/   # Example `codeEditor` adapters (copy these)
    │   └── App.tsx    # Main demo app
    └── dist/          # Built demo (generated)
```

### Code editor adapters

`src/editors/` holds the pluggable code editors the **Code Editor** example
switches between. They are demo code, not library exports — copy the one you
want into your own project and adapt it.

| File                        | Surface       | Dependencies                              | `canFormat` |
| --------------------------- | ------------- | ----------------------------------------- | ----------- |
| `CodeMirrorCodeEditor.tsx`  | CodeMirror 6  | `codemirror` + `@codemirror/*`            | `false`     |
| `AceCodeEditor.tsx`         | Ace           | `ace-builds`                              | `true`      |
| `HighlightCodeEditor.tsx`   | hand-rolled   | none (`highlight.ts` + a CSS file)        | `false`     |

The built-in `TextareaCodeEditor` and `MonacoCodeEditor` come from the library
itself, so they have no file here.

## Demo Examples

The demo includes several examples:

- **Quick Start**: Guided tour of the API
- **Basic Usage**: Simple usage with HTML and CSS editing, on the built-in textarea editor
- **Code Editor**: Switches the code panes between five surfaces — the built-in textarea editor, the optional `MonacoCodeEditor`, CodeMirror 6, Ace and a dependency-free custom editor
- **WYSIWYG**: The standalone rich-text editor
- **All Controls**: Every WYSIWYG control in one toolbar
- **Composition**: The editor assembled from its compound parts
- **Fullscreen Mode**: Fullscreen mode with split view
- **Auto-Save**: Demonstrates auto-save functionality
- **Themes**: Light and dark theme support
- **Error Handling**: Error state handling

## Adding New Examples

To add a new example:

1. Create a new file in `packages/demo/src/examples/`:

```tsx
// packages/demo/src/examples/MyExample.tsx
import { useState } from "react";
import { ContentEditor, ContentValue } from "react-html-content-editor";

function MyExample() {
  const [value, setValue] = useState<ContentValue>({
    html: "<h1>My Example</h1>",
    css: "h1 { color: blue; }",
  });

  return (
    <div className='example-container'>
      <div className='example-header'>
        <h2>My Example</h2>
        <p>Description of what this example demonstrates.</p>
      </div>

      <ContentEditor value={value} onChange={setValue} />
    </div>
  );
}

export default MyExample;
```

2. Register it in `App.tsx` — the id goes in the `ExampleTab` union, a `NAV`
   entry drives the sidebar, and a `PANELS` entry renders the page:

```tsx
import MyExample from "./examples/MyExample";

type ExampleTab = /* … */ | "my-example";

const NAV: NavGroup[] = [
  {
    title: "Examples",
    items: [
      // … existing items
      { id: "my-example", label: "My Example", icon: "✨" },
    ],
  },
];

const PANELS: Record<ExampleTab, ReactElement> = {
  // … existing panels
  "my-example": <MyExample />,
};
```

## Troubleshooting

### Changes Not Appearing

If your library changes aren't showing up in the demo:

1. Make sure you rebuilt the library: `cd packages/library && pnpm run build`
2. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check the browser console for errors
4. Verify the library build succeeded without errors

### Port Already in Use

If port 3000 is already in use, Vite will automatically try the next available port (3001, 3002, etc.). Check the terminal output for the actual URL.

### TypeScript Errors

If you see TypeScript errors in the demo after changing library types:

1. Rebuild the library to regenerate type declarations
2. Restart the TypeScript server in your IDE
3. Check `packages/library/dist/index.d.ts` was generated correctly

### CSS Not Loading

If styles aren't applying:

1. Verify the CSS is being built: check `packages/library/dist/style.css`
2. Ensure the CSS import is present in `packages/demo/src/main.tsx`:
   ```tsx
   import "react-html-content-editor/dist/style.css";
   ```

## Building for Production

Build both the library and demo for production:

```bash
# From the root directory
pnpm run build

# Or individually
cd packages/library && pnpm run build
cd packages/demo && pnpm run build
```

The demo production build will be in `packages/demo/dist/`.

## Contributing

When contributing to the library:

1. Make your changes in `packages/library/src/`
2. Add/update tests in the same directory
3. Test your changes using the demo app
4. Run tests: `pnpm run test`
5. Build the library: `pnpm run build`
6. Update documentation if needed
7. Submit a pull request

See the main [CONTRIBUTING.md](../library/CONTRIBUTING.md) for more details.
