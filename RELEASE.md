# Release Process

This document describes the automated versioning and npm publishing process using Changesets and GitHub Actions.

## 📋 Prerequisites

### 1. Configure NPM Token

To publish to npm automatically, you need to configure a token:

1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Go to **Account Settings** → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** (for CI/CD)
5. Copy the generated token

### 2. Add Secret on GitHub

1. Go to your repository on GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste the npm token
6. Click **Add secret**

### 3. Configure GitHub Actions Permissions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

## 🚀 Release Process

### Step 1: Create a Changeset

When you make changes that should be published, create a changeset:

```bash
pnpm changeset
```

You will be asked:

1. **Which package changed?** Select `react-html-content-editor`
2. **Type of change:**
   - `major` - Breaking changes (1.0.0 → 2.0.0)
   - `minor` - New features (1.0.0 → 1.1.0)
   - `patch` - Bug fixes (1.0.0 → 1.0.1)
3. **Description:** Write a summary of the changes

This will create a file in `.changeset/` with the change information.

### Step 2: Commit and Push

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### Step 3: GitHub Actions Automation

When you push to `main`, GitHub Actions will:

1. **CI Workflow** (`ci.yml`):
   - ✅ Run tests
   - ✅ Lint
   - ✅ Type check
   - ✅ Build

2. **Release Workflow** (`release.yml`):
   - 🔍 Detect pending changesets
   - 📝 Create a Pull Request named "chore: release packages"
   - 📦 The PR will include:
     - Version bump in `package.json`
     - Update to `CHANGELOG.md`
     - Removal of the processed changesets

### Step 4: Merge the Release PR

1. Review the release Pull Request
2. Verify that the version and changelog are correct
3. Merge the PR

### Step 5: Automatic Publishing

After merging the release PR:

1. ✅ GitHub Actions detects the merge
2. 📦 Builds the library
3. 🚀 Publishes to npm automatically
4. 🏷️ Creates a Git tag (e.g., `v1.0.1`)
5. 📋 Creates a GitHub Release with the changelog

### Re-running the release workflow by hand

`release.yml` also declares `workflow_dispatch`, so you can start it without
pushing: **Actions** → **Release** → **Run workflow**. Useful when a run failed
on a transient error (npm hiccup, expired token) and you want to retry without
an empty commit.

The workflow uses a `concurrency` group with `cancel-in-progress: true`, so a
newer run cancels an older one still in flight — the newest run wins and a stuck
run never blocks the next release.

## 📝 Changeset Examples

### Bug Fix (patch)

```bash
pnpm changeset
# Select: patch
# Description: "Fix cursor jumping issue in split view"
```

### New Feature (minor)

```bash
pnpm changeset
# Select: minor
# Description: "Add WYSIWYG toolbar with visual editing capabilities"
```

### Breaking Change (major)

```bash
pnpm changeset
# Select: major
# Description: "Change API: rename 'activeTab' prop to 'defaultView'"
```

## 🔄 Complete Workflow

```
1. Make code changes
   ↓
2. pnpm changeset (create changeset)
   ↓
3. git commit & push
   ↓
4. GitHub Actions runs CI
   ↓
5. GitHub Actions creates Release PR
   ↓
6. Review and merge the PR
   ↓
7. GitHub Actions publishes to npm
   ↓
8. Tag and Release created automatically
```

## 🛠️ Useful Commands

```bash
# Create a changeset
pnpm changeset

# View changeset status
pnpm changeset status

# Apply changesets locally (for testing)
pnpm changeset version

# Publish manually (if needed)
pnpm release

# Build before publishing
pnpm build
```

## 📊 Semantic Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
  - API changes that break compatibility
  - Removal of features
  - Significant changes in behavior

- **MINOR** (1.0.0 → 1.1.0): New features
  - New functionality
  - Improvements that don't break compatibility
  - Deprecations (but still functional)

- **PATCH** (1.0.0 → 1.0.1): Bug fixes
  - Bug fixes
  - Performance improvements
  - Documentation updates

## 🚨 Troubleshooting

### Error: "npm publish failed"

1. Check that `NPM_TOKEN` is configured correctly
2. Check that you have permission to publish the package
3. Check that the version doesn't already exist on npm

### Error: "Permission denied"

1. Check the GitHub Actions permissions
2. Make sure "Read and write permissions" is enabled

### Release PR was not created

1. Check that there are pending changesets: `pnpm changeset status`
2. Check the GitHub Actions logs
3. Make sure the push was to the `main` branch

## 📚 Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)

## 🎯 Release Checklist

Before making a release, verify:

- [ ] All tests are passing
- [ ] Build is working
- [ ] Documentation is up to date
- [ ] CHANGELOG is correct
- [ ] Version follows semantic versioning
- [ ] There are no undocumented breaking changes
- [ ] Demo examples are working
