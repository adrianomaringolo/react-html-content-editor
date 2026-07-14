# ✅ Release Configuration Checklist

Use this checklist to set up the automated release system.

## 📋 Initial Setup (Do once)

### 1. NPM Setup

- [ ] Create an account on [npmjs.com](https://www.npmjs.com/) (if you don't have one)
- [ ] Verify the npm account email
- [ ] Go to Account Settings → Access Tokens
- [ ] Click "Generate New Token" → "Classic Token"
- [ ] Select the "Automation" type
- [ ] Copy the generated token (keep it somewhere safe!)

### 2. GitHub Secrets

- [ ] Go to the GitHub repository
- [ ] Navigate to Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
- [ ] Name: `NPM_TOKEN`
- [ ] Value: Paste the npm token
- [ ] Click "Add secret"
- [ ] Verify that the secret appears in the list

### 3. GitHub Actions Permissions

- [ ] Go to Settings → Actions → General
- [ ] Under "Workflow permissions", select:
  - [ ] ✅ Read and write permissions
  - [ ] ✅ Allow GitHub Actions to create and approve pull requests
- [ ] Click "Save"

### 4. Package.json Configuration

- [ ] Verify that `name` is correct in `packages/library/package.json`
- [ ] Verify that `version` is "1.0.0" (or the desired version)
- [ ] Verify that `publishConfig.access` is set to "public"
- [ ] Verify that `repository` is configured

### 5. Verify Files

- [ ] `.github/workflows/ci.yml` exists
- [ ] `.github/workflows/release.yml` exists
- [ ] `.changeset/config.json` exists
- [ ] `.changeset/initial-release.md` exists
- [ ] `RELEASE.md` exists

## 🧪 Initial Test

### 1. Local Test

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Verify that the build generated the files
ls -la packages/library/dist/
```

- [ ] Tests passing
- [ ] Build working
- [ ] Files generated in `dist/`

### 2. Changeset Test

```bash
# Create a test changeset
pnpm changeset

# Check status
pnpm changeset status
```

- [ ] Changeset created successfully
- [ ] Status shows the pending changeset

### 3. CI Test (Optional)

```bash
# Commit and push to test CI
git add .
git commit -m "test: verify CI setup"
git push origin main
```

- [ ] GitHub Actions started
- [ ] CI workflow passed
- [ ] No errors in the logs

## 🚀 First Release

### 1. Prepare Release

- [ ] Verify that there is a changeset (`.changeset/initial-release.md`)
- [ ] Review the changeset description
- [ ] Verify the version that will be published

### 2. Push

```bash
git add .
git commit -m "chore: prepare initial release"
git push origin main
```

- [ ] Push completed successfully
- [ ] GitHub Actions started

### 3. Wait for the Release PR

- [ ] Release PR was created automatically
- [ ] PR has the title "chore: release packages"
- [ ] PR shows the version changes
- [ ] CHANGELOG.md was updated

### 4. Review and Merge

- [ ] Review the changes in the PR
- [ ] Verify that the version is correct
- [ ] Verify that the CHANGELOG is correct
- [ ] Merge the PR

### 5. Verify Publication

- [ ] GitHub Actions started after the merge
- [ ] Release workflow passed
- [ ] Package was published to npm
- [ ] Tag was created on GitHub
- [ ] GitHub Release was created

### 6. Verify on NPM

- [ ] Go to https://www.npmjs.com/package/react-html-content-editor
- [ ] Verify that the version is correct
- [ ] Verify that the files are correct
- [ ] Test the installation: `npm install react-html-content-editor`

## 📝 Future Releases

For each new release:

- [ ] Make code changes
- [ ] Create a changeset: `pnpm changeset`
- [ ] Commit and push
- [ ] Wait for the Release PR
- [ ] Review and merge
- [ ] Verify publication

## 🔍 Troubleshooting

If something goes wrong:

### CI Failed

- [ ] Check the GitHub Actions logs
- [ ] Run tests locally: `pnpm test`
- [ ] Check lint: `pnpm lint`
- [ ] Fix the errors and push again

### Release PR was not created

- [ ] Check whether there are changesets: `pnpm changeset status`
- [ ] Check the GitHub Actions logs
- [ ] Verify that you are on the `main` branch
- [ ] Check the GitHub Actions permissions

### Publication Failed

- [ ] Verify that NPM_TOKEN is configured
- [ ] Verify that the token is valid
- [ ] Verify that you have permission to publish
- [ ] Verify whether the version already exists on npm
- [ ] Check the GitHub Actions logs

### Tag was not created

- [ ] Verify that the workflow completed
- [ ] Check the GitHub Actions permissions
- [ ] Create the tag manually if necessary:
  ```bash
  git tag v1.0.0
  git push --tags
  ```

## 📚 Useful Resources

- [ ] Read [RELEASE.md](../RELEASE.md)
- [ ] Read [RELEASE_QUICK_GUIDE.md](./RELEASE_QUICK_GUIDE.md)
- [ ] Read [AUTOMATION_SUMMARY.md](./AUTOMATION_SUMMARY.md)
- [ ] Bookmark [Changesets Docs](https://github.com/changesets/changesets)
- [ ] Bookmark [GitHub Actions Docs](https://docs.github.com/en/actions)

## ✨ Tips

1. **Always test locally** before pushing
2. **Review the Release PR** carefully
3. **Use descriptive messages** in changesets
4. **Follow semantic versioning** when choosing the type
5. **Keep the CHANGELOG clean** and organized

## 🎉 Done!

Once all the items are checked, your automated release system will be up and running!

To make a release:

```bash
pnpm changeset
git add .
git commit -m "feat: add new feature"
git push origin main
```

And that's it! The rest is automatic! 🚀
