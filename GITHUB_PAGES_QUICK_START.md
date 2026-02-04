# 🚀 GitHub Pages - Quick Start

## TL;DR

```bash
# 1. Habilitar GitHub Pages no repositório
#    Settings → Pages → Source: GitHub Actions

# 2. Ajustar base path (se necessário)
#    packages/demo/vite.config.ts
#    base: "/seu-repo-aqui/"

# 3. Push para main
git push origin main

# 4. Aguardar deploy automático
# 5. Acessar: https://seu-usuario.github.io/seu-repo/
```

## ⚙️ Configuração (2 minutos)

### 1. Habilitar GitHub Pages

1. GitHub Repo → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Save

### 2. Ajustar Base Path

**Se o nome do repo for diferente de `react-html-content-editor`:**

Edite `packages/demo/vite.config.ts`:

```typescript
base: process.env.NODE_ENV === "production" ? "/SEU-REPO/" : "/",
```

### 3. Deploy

```bash
git add .
git commit -m "chore: setup GitHub Pages"
git push origin main
```

## 🌍 URL do Demo

```
https://SEU-USUARIO.github.io/SEU-REPO/
```

## ✅ Verificar

1. **Actions** → Ver workflow "Deploy Demo to GitHub Pages"
2. Aguardar conclusão (✅)
3. Acessar a URL

## 🔄 Atualizações

Deploy automático a cada push para `main` que modifique:

- `packages/demo/**`
- `packages/library/**`

## 📚 Documentação Completa

[docs/GITHUB_PAGES_SETUP.md](./docs/GITHUB_PAGES_SETUP.md)

## 🆘 Problemas?

### 404 Error

- Aguarde 5-10 minutos
- Limpe cache do navegador
- Verifique se GitHub Pages está habilitado

### Assets não carregam

- Verifique `base` no `vite.config.ts`
- Deve terminar com `/`

### Build falha

```bash
# Teste localmente
pnpm build:demo
```

## ✨ Pronto!

Seu demo está online e será atualizado automaticamente! 🎉
