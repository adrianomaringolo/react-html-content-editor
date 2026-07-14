# 🚀 Release Quick Guide

## TL;DR

```bash
# 1. Make code changes
# 2. Create changeset
pnpm changeset

# 3. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# 4. GitHub Actions creates a Release PR automatically
# 5. Merge the PR → Automatic publishing to npm
```

## 📊 Visual Flowchart

```
┌─────────────────────┐
│  Make code          │
│  changes            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  pnpm changeset     │
│  (create changeset) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  git commit & push  │
│  to main            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  GitHub Actions     │
│  runs CI tests      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  GitHub Actions     │
│  creates Release PR │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Review and merge   │
│  the PR             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  GitHub Actions     │
│  publishes to npm   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Tag and Release    │
│  created on GitHub  │
└─────────────────────┘
```

## 🎯 Essential Commands

### Create Changeset

```bash
pnpm changeset
```

### View Status

```bash
pnpm changeset status
```

### Interactive Helper

```bash
pnpm release:helper
```

## 📝 Version Types

| Type      | When to use                          | Example       |
| --------- | ------------------------------------ | ------------- |
| **patch** | Bug fixes, small corrections         | 1.0.0 → 1.0.1 |
| **minor** | New features, no breaking changes    | 1.0.0 → 1.1.0 |
| **major** | Breaking changes                     | 1.0.0 → 2.0.0 |

## ⚙️ Initial Setup (One time)

### 1. NPM Token

```bash
# 1. Generate token at npmjs.com
# 2. Add on GitHub:
#    Settings → Secrets → New secret
#    Name: NPM_TOKEN
#    Value: your_token_here
```

### 2. GitHub Permissions

```bash
# Settings → Actions → General
# ✅ Read and write permissions
# ✅ Allow GitHub Actions to create and approve pull requests
```

## 🔍 Check Before Release

```bash
# Tests
pnpm test

# Build
pnpm build

# Lint
pnpm lint

# View pending changesets
pnpm changeset status
```

## 🆘 Common Problems

### Release PR was not created

- Check for changesets: `pnpm changeset status`
- Check the GitHub Actions logs
- Make sure you are on the `main` branch

### Publishing failed

- Check the `NPM_TOKEN` in GitHub Secrets
- Check permissions on npmjs.com
- Check whether the version already exists

### Tests failing

- Run locally: `pnpm test`
- Fix the tests before merging

## 📚 Full Documentation

For more details, see:

- [RELEASE.md](../RELEASE.md) - Complete guide
- [Changesets Docs](https://github.com/changesets/changesets)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## 💡 Tips

1. **Always create changesets** for changes that should be published
2. **Review the Release PR** before merging
3. **Test locally** before pushing
4. **Use descriptive messages** in changesets
5. **Follow semantic versioning** when choosing the version type

## 🎉 Complete Example

```bash
# 1. Make changes
vim packages/library/src/components/ContentEditor.tsx

# 2. Create changeset
pnpm changeset
# Choose: minor
# Description: "Add toggle buttons for edit/preview modes"

# 3. Commit
git add .
git commit -m "feat: add toggle buttons for edit/preview modes"

# 4. Push
git push origin main

# 5. Wait for the Release PR to be created
# 6. Review and merge
# 7. Wait for automatic publishing
# 8. ✅ Done! New version on npm
```
