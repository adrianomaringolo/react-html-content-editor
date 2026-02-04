# Release Process

Este documento descreve o processo automatizado de versionamento e publicação no npm usando Changesets e GitHub Actions.

## 📋 Pré-requisitos

### 1. Configurar NPM Token

Para publicar no npm automaticamente, você precisa configurar um token:

1. Acesse [npmjs.com](https://www.npmjs.com/) e faça login
2. Vá em **Account Settings** → **Access Tokens**
3. Clique em **Generate New Token** → **Classic Token**
4. Selecione **Automation** (para CI/CD)
5. Copie o token gerado

### 2. Adicionar Secret no GitHub

1. Vá no seu repositório no GitHub
2. Acesse **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Nome: `NPM_TOKEN`
5. Value: Cole o token do npm
6. Clique em **Add secret**

### 3. Configurar Permissões do GitHub Actions

1. Vá em **Settings** → **Actions** → **General**
2. Em **Workflow permissions**, selecione:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Clique em **Save**

## 🚀 Processo de Release

### Passo 1: Criar um Changeset

Quando você fizer mudanças que devem ser publicadas, crie um changeset:

```bash
pnpm changeset
```

Você será perguntado:

1. **Qual package mudou?** Selecione `react-html-content-editor`
2. **Tipo de mudança:**
   - `major` - Breaking changes (1.0.0 → 2.0.0)
   - `minor` - Novas features (1.0.0 → 1.1.0)
   - `patch` - Bug fixes (1.0.0 → 1.0.1)
3. **Descrição:** Escreva um resumo das mudanças

Isso criará um arquivo em `.changeset/` com as informações da mudança.

### Passo 2: Commit e Push

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### Passo 3: Automação GitHub Actions

Quando você fizer push para `main`, o GitHub Actions irá:

1. **CI Workflow** (`ci.yml`):
   - ✅ Rodar testes
   - ✅ Fazer lint
   - ✅ Type check
   - ✅ Build

2. **Release Workflow** (`release.yml`):
   - 🔍 Detectar changesets pendentes
   - 📝 Criar um Pull Request chamado "chore: release packages"
   - 📦 O PR incluirá:
     - Atualização da versão no `package.json`
     - Atualização do `CHANGELOG.md`
     - Remoção dos changesets processados

### Passo 4: Merge do Release PR

1. Revise o Pull Request de release
2. Verifique se a versão e o changelog estão corretos
3. Faça merge do PR

### Passo 5: Publicação Automática

Após o merge do PR de release:

1. ✅ GitHub Actions detecta o merge
2. 📦 Faz build da biblioteca
3. 🚀 Publica no npm automaticamente
4. 🏷️ Cria uma tag Git (ex: `v1.0.1`)
5. 📋 Cria um GitHub Release com o changelog

## 📝 Exemplos de Changesets

### Bug Fix (patch)

```bash
pnpm changeset
# Selecione: patch
# Descrição: "Fix cursor jumping issue in split view"
```

### Nova Feature (minor)

```bash
pnpm changeset
# Selecione: minor
# Descrição: "Add WYSIWYG toolbar with visual editing capabilities"
```

### Breaking Change (major)

```bash
pnpm changeset
# Selecione: major
# Descrição: "Change API: rename 'activeTab' prop to 'defaultView'"
```

## 🔄 Workflow Completo

```
1. Fazer mudanças no código
   ↓
2. pnpm changeset (criar changeset)
   ↓
3. git commit & push
   ↓
4. GitHub Actions roda CI
   ↓
5. GitHub Actions cria Release PR
   ↓
6. Revisar e fazer merge do PR
   ↓
7. GitHub Actions publica no npm
   ↓
8. Tag e Release criados automaticamente
```

## 🛠️ Comandos Úteis

```bash
# Criar um changeset
pnpm changeset

# Ver status dos changesets
pnpm changeset status

# Aplicar changesets localmente (para testar)
pnpm changeset version

# Publicar manualmente (se necessário)
pnpm release

# Build antes de publicar
pnpm build
```

## 📊 Versionamento Semântico

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
  - Mudanças na API que quebram compatibilidade
  - Remoção de features
  - Mudanças significativas no comportamento

- **MINOR** (1.0.0 → 1.1.0): Novas features
  - Novas funcionalidades
  - Melhorias que não quebram compatibilidade
  - Deprecações (mas ainda funcionam)

- **PATCH** (1.0.0 → 1.0.1): Bug fixes
  - Correções de bugs
  - Melhorias de performance
  - Atualizações de documentação

## 🚨 Troubleshooting

### Erro: "npm publish failed"

1. Verifique se o `NPM_TOKEN` está configurado corretamente
2. Verifique se você tem permissão para publicar o package
3. Verifique se a versão já não existe no npm

### Erro: "Permission denied"

1. Verifique as permissões do GitHub Actions
2. Certifique-se de que "Read and write permissions" está habilitado

### Release PR não foi criado

1. Verifique se há changesets pendentes: `pnpm changeset status`
2. Verifique os logs do GitHub Actions
3. Certifique-se de que o push foi para a branch `main`

## 📚 Recursos

- [Changesets Documentation](https://github.com/changesets/changesets)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)

## 🎯 Checklist de Release

Antes de fazer um release, verifique:

- [ ] Todos os testes estão passando
- [ ] Build está funcionando
- [ ] Documentação está atualizada
- [ ] CHANGELOG está correto
- [ ] Versão segue semantic versioning
- [ ] Não há breaking changes não documentadas
- [ ] Exemplos no demo estão funcionando
