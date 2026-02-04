# 🚀 Guia Rápido de Release

## TL;DR

```bash
# 1. Fazer mudanças no código
# 2. Criar changeset
pnpm changeset

# 3. Commit e push
git add .
git commit -m "feat: add new feature"
git push origin main

# 4. GitHub Actions cria Release PR automaticamente
# 5. Merge do PR → Publicação automática no npm
```

## 📊 Fluxograma Visual

```
┌─────────────────────┐
│  Fazer mudanças     │
│  no código          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  pnpm changeset     │
│  (criar changeset)  │
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
│  roda CI tests      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  GitHub Actions     │
│  cria Release PR    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Revisar e fazer    │
│  merge do PR        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  GitHub Actions     │
│  publica no npm     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Tag e Release      │
│  criados no GitHub  │
└─────────────────────┘
```

## 🎯 Comandos Essenciais

### Criar Changeset

```bash
pnpm changeset
```

### Ver Status

```bash
pnpm changeset status
```

### Helper Interativo

```bash
pnpm release:helper
```

## 📝 Tipos de Versão

| Tipo      | Quando usar                          | Exemplo       |
| --------- | ------------------------------------ | ------------- |
| **patch** | Bug fixes, pequenas correções        | 1.0.0 → 1.0.1 |
| **minor** | Novas features, sem breaking changes | 1.0.0 → 1.1.0 |
| **major** | Breaking changes                     | 1.0.0 → 2.0.0 |

## ⚙️ Configuração Inicial (Uma vez)

### 1. NPM Token

```bash
# 1. Gerar token em npmjs.com
# 2. Adicionar no GitHub:
#    Settings → Secrets → New secret
#    Nome: NPM_TOKEN
#    Value: seu_token_aqui
```

### 2. GitHub Permissions

```bash
# Settings → Actions → General
# ✅ Read and write permissions
# ✅ Allow GitHub Actions to create and approve pull requests
```

## 🔍 Verificar Antes de Release

```bash
# Testes
pnpm test

# Build
pnpm build

# Lint
pnpm lint

# Ver changesets pendentes
pnpm changeset status
```

## 🆘 Problemas Comuns

### Release PR não foi criado

- Verifique se há changesets: `pnpm changeset status`
- Verifique os logs do GitHub Actions
- Certifique-se de estar na branch `main`

### Publicação falhou

- Verifique o `NPM_TOKEN` no GitHub Secrets
- Verifique permissões no npmjs.com
- Verifique se a versão já existe

### Testes falhando

- Rode localmente: `pnpm test`
- Corrija os testes antes de fazer merge

## 📚 Documentação Completa

Para mais detalhes, veja:

- [RELEASE.md](../RELEASE.md) - Guia completo
- [Changesets Docs](https://github.com/changesets/changesets)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## 💡 Dicas

1. **Sempre crie changesets** para mudanças que devem ser publicadas
2. **Revise o Release PR** antes de fazer merge
3. **Teste localmente** antes de fazer push
4. **Use mensagens descritivas** nos changesets
5. **Siga semantic versioning** ao escolher o tipo de versão

## 🎉 Exemplo Completo

```bash
# 1. Fazer mudanças
vim packages/library/src/components/ContentEditor.tsx

# 2. Criar changeset
pnpm changeset
# Escolher: minor
# Descrição: "Add toggle buttons for edit/preview modes"

# 3. Commit
git add .
git commit -m "feat: add toggle buttons for edit/preview modes"

# 4. Push
git push origin main

# 5. Aguardar Release PR ser criado
# 6. Revisar e fazer merge
# 7. Aguardar publicação automática
# 8. ✅ Pronto! Nova versão no npm
```
