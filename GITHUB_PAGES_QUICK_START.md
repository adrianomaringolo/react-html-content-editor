# 🚀 GitHub Pages - Quick Start

## TL;DR

```bash
# 1. Enable GitHub Pages in the repository
#    Settings → Pages → Source: GitHub Actions

# 2. Adjust the base path (if necessary)
#    packages/demo/vite.config.ts
#    base: "/your-repo-here/"

# 3. Push to main
git push origin main

# 4. Wait for the automatic deploy
# 5. Visit: https://your-username.github.io/your-repo/
```

## ⚙️ Configuration (2 minutes)

### 1. Enable GitHub Pages

1. GitHub Repo → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Save

### 2. Adjust the Base Path

**If the repo name is different from `react-html-content-editor`:**

Edit `packages/demo/vite.config.ts`:

```typescript
base: process.env.NODE_ENV === "production" ? "/YOUR-REPO/" : "/",
```

### 3. Deploy

```bash
git add .
git commit -m "chore: setup GitHub Pages"
git push origin main
```

## 🌍 Demo URL

```
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

## ✅ Verify

1. **Actions** → View the "Deploy Demo to GitHub Pages" workflow
2. Wait for it to finish (✅)
3. Visit the URL

## 🔄 Updates

Automatic deploy on every push to `main` that modifies:

- `packages/demo/**`
- `packages/library/**`

## 📚 Full Documentation

[docs/GITHUB_PAGES_SETUP.md](./docs/GITHUB_PAGES_SETUP.md)

## 🆘 Problems?

### 404 Error

- Wait 5-10 minutes
- Clear the browser cache
- Check that GitHub Pages is enabled

### Assets not loading

- Check `base` in `vite.config.ts`
- It must end with `/`

### Build fails

```bash
# Test locally
pnpm build:demo
```

## ✨ Done!

Your demo is online and will be updated automatically! 🎉
