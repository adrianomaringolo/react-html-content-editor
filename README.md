# React HTML Content Editor

A sophisticated HTML and CSS content editor with Monaco Editor integration, multiple view modes, scroll synchronization, and auto-save functionality.

## Project Structure

This is a pnpm workspace monorepo containing:

- `packages/library` - The main library package
- `packages/demo` - Demo application showcasing the library

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
pnpm install
```

### Development

Run the demo app in development mode:

```bash
pnpm dev
```

Build the library:

```bash
pnpm build
```

Build all packages:

```bash
pnpm build:all
```

Run tests:

```bash
pnpm test
```

## Packages

### @sympro/react-html-content-editor

The main library package. See `packages/library/README.md` for detailed documentation.

### demo

Demo application showcasing all features of the library.

## License

MIT
