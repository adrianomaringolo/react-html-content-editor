# 🚀 Quick Start - Release System

## TL;DR

```bash
# 1. Configure NPM_TOKEN on GitHub (one time)
# 2. Make code changes
# 3. Create changeset
pnpm changeset

# 4. Push
git add . && git commit -m "feat: add feature" && git push

# 5. Wait for Release PR → Merge → Automatic publishing ✨
```

## ⚙️ Initial Setup (5 minutes)

### 1. NPM Token

1. [npmjs.com](https://www.npmjs.com/) → Account Settings → Access Tokens
2. Generate New Token → Automation
3. Copy token

### 2. GitHub Secret

1. Repo → Settings → Secrets → Actions
2. New secret: `NPM_TOKEN` = (your token)

### 3. GitHub Permissions

1. Settings → Actions → General
2. ✅ Read and write permissions
3. ✅ Allow GitHub Actions to create and approve pull requests

## 📝 Daily Use

```bash
# Create changeset
pnpm changeset
# Choose: patch (bug) | minor (feature) | major (breaking)

# Push
git add .
git commit -m "feat: description"
git push origin main

# Wait for Release PR
# Merge
# ✅ Published automatically!
```

## 🎯 Version Types

- **patch** (1.0.0 → 1.0.1): Bug fixes
- **minor** (1.0.0 → 1.1.0): New features
- **major** (1.0.0 → 2.0.0): Breaking changes

## 📚 Full Documentation

- [RELEASE.md](./RELEASE.md) - Complete guide
- [docs/RELEASE_QUICK_GUIDE.md](./docs/RELEASE_QUICK_GUIDE.md) - Visual guide
- [docs/SETUP_CHECKLIST.md](./docs/SETUP_CHECKLIST.md) - Checklist
- [docs/RELEASE_SETUP_COMPLETE.md](./docs/RELEASE_SETUP_COMPLETE.md) - Status

## 🛠️ Interactive Helper

```bash
pnpm release:helper
```

Menu with options:

1. Create changeset
2. View status
3. Apply changesets
4. Publish manually
5. View latest release

## ✅ Done!

System configured and ready to use! 🎉
