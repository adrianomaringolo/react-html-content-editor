# Contributing to React HTML Content Editor

Thank you for your interest in contributing to React HTML Content Editor! This document provides guidelines and instructions for contributing to the project.

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/react-html-content-editor.git
cd react-html-content-editor
```

2. Install dependencies:

```bash
pnpm install
```

This will install dependencies for all packages in the monorepo (library and demo).

### Project Structure

The project uses a pnpm workspace monorepo structure:

```
react-html-content-editor/
├── packages/
│   ├── library/          # The main library package
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── demo/             # Demo application
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
│
├── package.json          # Root workspace config
└── pnpm-workspace.yaml
```

## Development Workflow

### Running the Demo App

The demo app is the best way to test changes during development:

```bash
# From the root directory
pnpm --filter demo dev

# Or from the demo directory
cd packages/demo
pnpm dev
```

The demo app will be available at `http://localhost:5173` and will hot-reload when you make changes to the library.

### Building the Library

To build the library for production:

```bash
# From the root directory
pnpm --filter library build

# Or from the library directory
cd packages/library
pnpm build
```

This will:

- Compile TypeScript to JavaScript
- Generate type definitions (.d.ts files)
- Bundle CSS
- Create both ES module and CommonJS builds
- Generate source maps

Build output is in `packages/library/dist/`.

### Running Tests

The library uses Vitest for testing with both unit tests and property-based tests.

```bash
# Run all tests once
pnpm --filter library test

# Run tests in watch mode
pnpm --filter library test:watch

# Run tests with coverage
pnpm --filter library test -- --coverage
```

### Type Checking

```bash
# Type check the library
pnpm --filter library type-check

# Type check the demo
pnpm --filter demo type-check
```

### Linting

```bash
# Lint the library
pnpm --filter library lint

# Lint the demo
pnpm --filter demo lint
```

## Making Changes

### Creating a Branch

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Writing Code

- Follow the existing code style and conventions
- Write TypeScript with strict mode enabled
- Add JSDoc comments for all exported functions and types
- Keep components small and focused
- Use CSS modules for styling
- Avoid adding new dependencies unless absolutely necessary

### Writing Tests

All new features and bug fixes should include tests:

**Unit Tests**: Test specific examples and edge cases

```typescript
import { render, screen } from '@testing-library/react';
import { ContentEditor } from './ContentEditor';

describe('ContentEditor', () => {
  it('should render with initial value', () => {
    const value = { html: '<h1>Hello</h1>', css: '' };
    render(<ContentEditor value={value} onChange={() => {}} />);
    // Add assertions
  });
});
```

**Property-Based Tests**: Test universal properties across randomized inputs

```typescript
import fc from "fast-check";

describe("Property: Content Change Propagation", () => {
  it("should call onChange with both values", () => {
    fc.assert(
      fc.property(
        fc.record({ html: fc.string(), css: fc.string() }),
        (value) => {
          // Test property holds for all inputs
        },
      ),
      { numRuns: 100 },
    );
  });
});
```

### Testing Your Changes

Before submitting a pull request:

1. Run all tests: `pnpm --filter library test`
2. Type check: `pnpm --filter library type-check`
3. Build the library: `pnpm --filter library build`
4. Test in the demo app: `pnpm --filter demo dev`
5. Test the built package:

```bash
cd packages/library
pnpm pack
# Install the tarball in a test project
```

## Versioning and Releases

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

### Creating a Changeset

When you make changes that should be included in the changelog, create a changeset:

```bash
pnpm changeset
```

This will prompt you to:

1. Select which packages have changed (usually just `library`)
2. Select the type of change:
   - **patch**: Bug fixes, minor improvements (0.0.X)
   - **minor**: New features, non-breaking changes (0.X.0)
   - **major**: Breaking changes (X.0.0)
3. Write a summary of the changes

The changeset will be saved in `.changeset/` and should be committed with your changes.

### Changeset Guidelines

- Create one changeset per logical change
- Write clear, user-focused summaries
- Use present tense ("Add feature" not "Added feature")
- Include migration instructions for breaking changes

**Example changeset summaries:**

```markdown
# Patch

Fix scroll synchronization with empty content

# Minor

Add support for custom Monaco Editor themes

# Major

BREAKING CHANGE: Update ContentValue interface to require explicit null handling

The `value` prop now requires both `html` and `css` to be strings.
Previously, `null` or `undefined` were accepted.

Migration: Replace `null` with empty strings `""`.
```

### Publishing (Maintainers Only)

To publish a new version:

```bash
# 1. Consume changesets and bump versions
pnpm changeset version

# 2. Build the library
pnpm --filter library build

# 3. Commit the version changes
git add .
git commit -m "chore: release"

# 4. Publish to npm
pnpm --filter library publish

# 5. Push changes and tags
git push --follow-tags
```

## Pull Request Process

1. **Fork the repository** and create your branch from `main`

2. **Make your changes** following the guidelines above

3. **Create a changeset** if your changes affect the public API

4. **Ensure all tests pass** and the build succeeds

5. **Update documentation** if you're adding or changing features

6. **Submit a pull request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Link to any related issues
   - Screenshots/GIFs for UI changes

7. **Respond to feedback** from maintainers

### Pull Request Checklist

- [ ] Tests pass (`pnpm --filter library test`)
- [ ] Type checking passes (`pnpm --filter library type-check`)
- [ ] Build succeeds (`pnpm --filter library build`)
- [ ] Changeset created (if applicable)
- [ ] Documentation updated (if applicable)
- [ ] Demo app tested
- [ ] Code follows existing style and conventions

## Code Style

- Use TypeScript strict mode
- Use functional components with hooks
- Prefer `const` over `let`
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic
- Use CSS modules for styling
- Follow existing naming conventions

## Commit Messages

We follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(editor): add support for custom themes

fix(scroll): prevent infinite loop in scroll sync

docs(readme): update installation instructions

test(hooks): add property tests for useAutoSave
```

## Getting Help

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues and discussions first

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue or discussion if you have any questions about contributing!
