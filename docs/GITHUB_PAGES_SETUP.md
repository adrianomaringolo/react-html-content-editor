# 🌐 GitHub Pages Setup - Demo App

This guide explains how to configure and deploy the demo app on GitHub Pages.

## 📋 Initial Setup (One time)

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Open **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **GitHub Actions**
4. Click **Save**

### 2. Adjust the Base Path (If necessary)

If your repository name is different from `react-html-content-editor`, adjust it in:

**`packages/demo/vite.config.ts`:**

```typescript
base: process.env.NODE_ENV === "production" ? "/YOUR-REPO-HERE/" : "/",
```

Replace `YOUR-REPO-HERE` with your repository name.

## 🚀 Automatic Deploy

### When the Deploy Happens

The deploy is automatic when:

- ✅ You push to `main`
- ✅ There are changes in `packages/demo/**` or `packages/library/**`
- ✅ You run the workflow manually

### Deploy Flow

```
1. Push to main
   ↓
2. GitHub Actions detects changes
   ↓
3. Build the library
   ↓
4. Build the demo
   ↓
5. Deploy to GitHub Pages
   ↓
6. Site available at: https://your-username.github.io/react-html-content-editor/
```

## 🔧 Manual Deploy

### Via GitHub Actions

1. Go to **Actions** on GitHub
2. Select **Deploy Demo to GitHub Pages**
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow**

### Via Command Line

```bash
# Local build
pnpm build:demo

# The files will be in packages/demo/dist/
# To test locally:
cd packages/demo/dist
python -m http.server 8000
# Visit: http://localhost:8000
```

## 🌍 Demo URL

After the deploy, your demo will be available at:

```
https://YOUR-USERNAME.github.io/react-html-content-editor/
```

Replace:

- `YOUR-USERNAME` with your GitHub username
- `react-html-content-editor` with your repository name

## 📝 File Structure

```
packages/demo/
├── dist/                    # Build output (generated)
├── public/
│   └── .nojekyll           # Disables Jekyll
├── src/
│   ├── examples/           # Demo examples
│   ├── App.tsx            # Main app
│   └── main.tsx           # Entry point
└── vite.config.ts         # Vite configuration
```

## ⚙️ Vite Configuration

**`packages/demo/vite.config.ts`:**

```typescript
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages
  base:
    process.env.NODE_ENV === "production" ? "/react-html-content-editor/" : "/",
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "terser",
  },
});
```

## 🔍 Verify the Deploy

### 1. Workflow Status

1. Go to **Actions** on GitHub
2. Look at the **Deploy Demo to GitHub Pages** workflow
3. Check that it is green (✅)

### 2. Access the Site

1. Go to **Settings** → **Pages**
2. Look at the published site URL
3. Click to visit it

### 3. Check the Logs

If there are problems:

1. **Actions** → Select the workflow that failed
2. Click the job that failed
3. View the detailed logs

## 🐛 Troubleshooting

### 404 Page

**Problem:** A 404 appears when accessing the URL.

**Solutions:**

1. Check that GitHub Pages is enabled
2. Check that the workflow completed successfully
3. Wait a few minutes (it can take up to 10 minutes)
4. Clear the browser cache

### Assets not loading

**Problem:** CSS/JS do not load, and the console shows 404.

**Solution:**

1. Check the `base` in `vite.config.ts`
2. It should be: `"/repo-name/"`
3. Rebuild and redeploy

### Workflow fails on build

**Problem:** The build fails in GitHub Actions.

**Solutions:**

1. Test the build locally: `pnpm build:demo`
2. Check the GitHub Actions logs
3. Make sure all dependencies are in `package.json`

### Changes not showing up

**Problem:** I made changes but the site did not update.

**Solutions:**

1. Check that the workflow ran
2. Clear the browser cache (Ctrl+Shift+R)
3. Wait a few minutes
4. Check that you pushed to `main`

## 🎨 Customization

### Add a Custom Domain

1. **Settings** → **Pages**
2. Under **Custom domain**, add your domain
3. Configure your domain's DNS:
   ```
   CNAME: your-username.github.io
   ```

### Add Google Analytics

**`packages/demo/index.html`:**

```html
<head>
  <!-- Google Analytics -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  ></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "GA_MEASUREMENT_ID");
  </script>
</head>
```

### Add Meta Tags for SEO

**`packages/demo/index.html`:**

```html
<head>
  <meta name="description" content="React HTML Content Editor - Demo" />
  <meta property="og:title" content="React HTML Content Editor" />
  <meta property="og:description" content="A powerful HTML and CSS editor" />
  <meta property="og:image" content="/preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

## 📊 Monitoring

### View Statistics

1. **Insights** → **Traffic**
2. View visitors, views, referrers

### View Deploys

1. **Actions** → **Deploy Demo to GitHub Pages**
2. View the deploy history

## 🔄 Update the Demo

```bash
# 1. Make changes to the demo
vim packages/demo/src/App.tsx

# 2. Test locally
pnpm dev

# 3. Commit and push
git add .
git commit -m "feat: update demo"
git push origin main

# 4. The automatic deploy happens!
```

## ✅ Deploy Checklist

Before the first deploy:

- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] Correct base path in `vite.config.ts`
- [ ] `.nojekyll` exists in `packages/demo/public/`
- [ ] The `deploy-demo.yml` workflow exists
- [ ] Local build works: `pnpm build:demo`

After the deploy:

- [ ] Workflow completed successfully
- [ ] Site accessible at the URL
- [ ] Assets load correctly
- [ ] Navigation works
- [ ] Examples work

## 🎉 Done!

Your demo is configured and will be updated automatically on every push to `main`!

**Demo URL:**

```
https://your-username.github.io/react-html-content-editor/
```

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 💡 Tips

1. **Test locally** before pushing
2. **Use branches** to test large changes
3. **Monitor the workflows** to catch problems early
4. **Keep the demo up to date** with the library's latest features
5. **Add examples** to showcase all the functionality
