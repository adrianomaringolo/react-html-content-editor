# 🚀 Quick Start - Sistema de Release

## TL;DR

```bash
# 1. Configurar NPM_TOKEN no GitHub (uma vez)
# 2. Fazer mudanças no código
# 3. Criar changeset
pnpm changeset

# 4. Push
git add . && git commit -m "feat: add feature" && git push

# 5. Aguardar Release PR → Merge → Publicação automática ✨
```

## ⚙️ Configuração Inicial (5 minutos)

### 1. NPM Token

1. [npmjs.com](https://www.npmjs.com/) → Account Settings → Access Tokens
2. Generate New Token → Automation
3. Copiar token

### 2. GitHub Secret

1. Repo → Settings → Secrets → Actions
2. New secret: `NPM_TOKEN` = (seu token)

### 3. GitHub Permissions

1. Settings → Actions → General
2. ✅ Read and write permissions
3. ✅ Allow GitHub Actions to create and approve pull requests

## 📝 Uso Diário

```bash
# Criar changeset
pnpm changeset
# Escolher: patch (bug) | minor (feature) | major (breaking)

# Push
git add .
git commit -m "feat: description"
git push origin main

# Aguardar Release PR
# Fazer merge
# ✅ Publicado automaticamente!
```

## 🎯 Tipos de Versão

- **patch** (1.0.0 → 1.0.1): Bug fixes
- **minor** (1.0.0 → 1.1.0): Novas features
- **major** (1.0.0 → 2.0.0): Breaking changes

## 📚 Documentação Completa

- [RELEASE.md](./RELEASE.md) - Guia completo
- [docs/RELEASE_QUICK_GUIDE.md](./docs/RELEASE_QUICK_GUIDE.md) - Guia visual
- [docs/SETUP_CHECKLIST.md](./docs/SETUP_CHECKLIST.md) - Checklist
- [docs/RELEASE_SETUP_COMPLETE.md](./docs/RELEASE_SETUP_COMPLETE.md) - Status

## 🛠️ Helper Interativo

```bash
pnpm release:helper
```

Menu com opções:

1. Criar changeset
2. Ver status
3. Aplicar changesets
4. Publicar manualmente
5. Ver último release

## ✅ Pronto!

Sistema configurado e pronto para uso! 🎉
