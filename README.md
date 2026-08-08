<p align="center">
  <img src="assets/cover.png" alt="React HTML Content Editor — HTML/CSS editor with a live preview and an integrated WYSIWYG mode" width="100%" />
</p>

# React HTML Content Editor

[![npm version](https://badge.fury.io/js/react-html-content-editor.svg)](https://www.npmjs.com/package/react-html-content-editor)
[![CI](https://github.com/adrianomaringolo/react-html-content-editor/workflows/CI/badge.svg)](https://github.com/adrianomaringolo/react-html-content-editor/actions)
[![Deploy Demo](https://github.com/adrianomaringolo/react-html-content-editor/workflows/Deploy%20Demo%20to%20GitHub%20Pages/badge.svg)](https://github.com/adrianomaringolo/react-html-content-editor/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React HTML and CSS content editor with a live preview, an integrated rich-text
WYSIWYG mode, auto-save and a composition API. Code editing works out of the box
with **no editor dependency**, and upgrades to Monaco (the engine behind VS Code)
with a single prop.

> **Looking for the API docs?** They live in
> [`packages/library/README.md`](./packages/library/README.md). This file covers
> the repository itself.

## 🌐 Live demo

[**adrianomaringolo.github.io/react-html-content-editor**](https://adrianomaringolo.github.io/react-html-content-editor/)
— runnable examples for every feature, redeployed on each push to `main`.

## ✨ What's in the box

- **HTML + CSS editor** with edit / preview / split view modes, synchronized
  scrolling, fullscreen and auto-save status
- **Pluggable code editors** — a dependency-free textarea by default; swap in
  Monaco, CodeMirror, Ace or your own surface via one `codeEditor` prop
- **Integrated WYSIWYG** — toggle between the code view and a rich-text editor,
  both editing the same value
- **Standalone WYSIWYG** with ~50 opt-in controls: formatting, colors, lists,
  task lists, tables, callouts, images, links, find & replace, print and export
- **Composition API** — assemble the editor from its parts, or drop in the
  batteries-included default
- **TypeScript first**, themeable through CSS variables, no framework or UI
  library required

## 📦 Install

```bash
npm install react-html-content-editor
```

```tsx
import { useState } from "react";
import { ContentEditor } from "react-html-content-editor";
import "react-html-content-editor/dist/style.css";

function App() {
  const [value, setValue] = useState({
    html: "<h1>Hello World</h1>",
    css: "h1 { color: teal; }",
  });

  return <ContentEditor value={value} onChange={setValue} />;
}
```

Full API, props and the WYSIWYG control reference:
[**library README**](./packages/library/README.md).

## 🧱 Repository layout

This is a pnpm workspace monorepo:

| Path               | Package                      | What it is                                                            |
| ------------------ | ---------------------------- | --------------------------------------------------------------------- |
| `packages/library` | `react-html-content-editor`  | The published library.                                                |
| `packages/demo`    | `demo` (private)             | The demo/docs site deployed to GitHub Pages.                          |
| `docs/`            | —                            | Repository docs: CI, releases, GitHub Pages setup.                    |
| `llms.txt`         | —                            | Self-contained, LLM-optimized API reference (also served at `/llms.txt`). |

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Setup

```bash
pnpm install
```

### Scripts

Run from the repository root:

| Command             | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `pnpm dev`          | Start the demo app in dev mode.                                   |
| `pnpm build`        | Build the library only.                                           |
| `pnpm build:all`    | Build every package.                                              |
| `pnpm build:demo`   | Build the library, then the demo (what CI deploys).               |
| `pnpm test`         | Run the test suites.                                              |
| `pnpm lint`         | Lint every package.                                               |
| `pnpm changeset`    | Record a change for the next release.                             |
| `pnpm release`      | Build and publish (normally done by CI).                          |
| `pnpm release:helper` | Interactive release menu (`scripts/release-helper.sh`).         |

The demo consumes the library through the workspace, so rebuild the library
(`pnpm build`) to see library changes in the demo — see the
[demo README](./packages/demo/README.md) for the fast watch-mode loop.

## 🚀 Releases

Automated with [Changesets](https://github.com/changesets/changesets) and GitHub
Actions:

1. Make your changes
2. Create a changeset: `pnpm changeset`
3. Commit and push to `main`
4. GitHub Actions opens a "chore: release packages" PR
5. Merge it — the package is published to npm and tagged automatically

Full details, including the manual workflow trigger, in [RELEASE.md](./RELEASE.md).

## 📚 Documentation

**Using the library**

- [Library README](./packages/library/README.md) — full API reference
- [Live demo & docs site](https://adrianomaringolo.github.io/react-html-content-editor/)
- [Keyboard shortcuts](./packages/library/KEYBOARD_SHORTCUTS.md)
- [`llms.txt`](./llms.txt) — one-file reference for AI coding agents
- [Changelog](./packages/library/CHANGELOG.md)

**Working on the repository**

- [Contributing guide](./packages/library/CONTRIBUTING.md)
- [Demo app guide](./packages/demo/README.md)
- [Release process](./RELEASE.md) · [quick start](./QUICK_START_RELEASE.md) · [visual guide](./docs/RELEASE_QUICK_GUIDE.md)
- [GitHub Pages setup](./docs/GITHUB_PAGES_SETUP.md) · [quick start](./GITHUB_PAGES_QUICK_START.md)
- [CI troubleshooting](./docs/CI_TROUBLESHOOTING.md)
- [Setup checklist](./docs/SETUP_CHECKLIST.md)

## 🤝 Contributing

Contributions are welcome. Please read the
[Contributing Guide](./packages/library/CONTRIBUTING.md) and the
[Release Process](./RELEASE.md) before opening a PR.

## License

MIT © [Adriano Maringolo](https://github.com/adrianomaringolo)
