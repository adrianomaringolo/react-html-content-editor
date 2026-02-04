# ✅ Checklist de Configuração de Release

Use este checklist para configurar o sistema de release automatizado.

## 📋 Configuração Inicial (Fazer uma vez)

### 1. NPM Setup

- [ ] Criar conta no [npmjs.com](https://www.npmjs.com/) (se não tiver)
- [ ] Verificar email da conta npm
- [ ] Ir em Account Settings → Access Tokens
- [ ] Clicar em "Generate New Token" → "Classic Token"
- [ ] Selecionar tipo "Automation"
- [ ] Copiar o token gerado (guarde em local seguro!)

### 2. GitHub Secrets

- [ ] Ir no repositório do GitHub
- [ ] Acessar Settings → Secrets and variables → Actions
- [ ] Clicar em "New repository secret"
- [ ] Nome: `NPM_TOKEN`
- [ ] Value: Colar o token do npm
- [ ] Clicar em "Add secret"
- [ ] Verificar se o secret aparece na lista

### 3. GitHub Actions Permissions

- [ ] Ir em Settings → Actions → General
- [ ] Em "Workflow permissions", selecionar:
  - [ ] ✅ Read and write permissions
  - [ ] ✅ Allow GitHub Actions to create and approve pull requests
- [ ] Clicar em "Save"

### 4. Package.json Configuration

- [ ] Verificar se `name` está correto em `packages/library/package.json`
- [ ] Verificar se `version` está em "1.0.0" (ou versão desejada)
- [ ] Verificar se `publishConfig.access` está como "public"
- [ ] Verificar se `repository` está configurado

### 5. Verificar Arquivos

- [ ] `.github/workflows/ci.yml` existe
- [ ] `.github/workflows/release.yml` existe
- [ ] `.changeset/config.json` existe
- [ ] `.changeset/initial-release.md` existe
- [ ] `RELEASE.md` existe

## 🧪 Teste Inicial

### 1. Teste Local

```bash
# Instalar dependências
pnpm install

# Rodar testes
pnpm test

# Build
pnpm build

# Verificar se o build gerou os arquivos
ls -la packages/library/dist/
```

- [ ] Testes passando
- [ ] Build funcionando
- [ ] Arquivos gerados em `dist/`

### 2. Teste de Changeset

```bash
# Criar um changeset de teste
pnpm changeset

# Ver status
pnpm changeset status
```

- [ ] Changeset criado com sucesso
- [ ] Status mostra o changeset pendente

### 3. Teste de CI (Opcional)

```bash
# Commit e push para testar CI
git add .
git commit -m "test: verify CI setup"
git push origin main
```

- [ ] GitHub Actions iniciou
- [ ] CI workflow passou
- [ ] Nenhum erro nos logs

## 🚀 Primeiro Release

### 1. Preparar Release

- [ ] Verificar se há um changeset (`.changeset/initial-release.md`)
- [ ] Revisar a descrição do changeset
- [ ] Verificar a versão que será publicada

### 2. Fazer Push

```bash
git add .
git commit -m "chore: prepare initial release"
git push origin main
```

- [ ] Push realizado com sucesso
- [ ] GitHub Actions iniciou

### 3. Aguardar Release PR

- [ ] Release PR foi criado automaticamente
- [ ] PR tem título "chore: release packages"
- [ ] PR mostra as mudanças de versão
- [ ] CHANGELOG.md foi atualizado

### 4. Revisar e Merge

- [ ] Revisar as mudanças no PR
- [ ] Verificar se a versão está correta
- [ ] Verificar se o CHANGELOG está correto
- [ ] Fazer merge do PR

### 5. Verificar Publicação

- [ ] GitHub Actions iniciou após merge
- [ ] Workflow de release passou
- [ ] Package foi publicado no npm
- [ ] Tag foi criada no GitHub
- [ ] GitHub Release foi criado

### 6. Verificar no NPM

- [ ] Acessar https://www.npmjs.com/package/react-html-content-editor
- [ ] Verificar se a versão está correta
- [ ] Verificar se os arquivos estão corretos
- [ ] Testar instalação: `npm install react-html-content-editor`

## 📝 Releases Futuros

Para cada novo release:

- [ ] Fazer mudanças no código
- [ ] Criar changeset: `pnpm changeset`
- [ ] Commit e push
- [ ] Aguardar Release PR
- [ ] Revisar e fazer merge
- [ ] Verificar publicação

## 🔍 Troubleshooting

Se algo der errado:

### CI Falhou

- [ ] Verificar logs do GitHub Actions
- [ ] Rodar testes localmente: `pnpm test`
- [ ] Verificar lint: `pnpm lint`
- [ ] Corrigir erros e fazer novo push

### Release PR não foi criado

- [ ] Verificar se há changesets: `pnpm changeset status`
- [ ] Verificar logs do GitHub Actions
- [ ] Verificar se está na branch `main`
- [ ] Verificar permissões do GitHub Actions

### Publicação Falhou

- [ ] Verificar se NPM_TOKEN está configurado
- [ ] Verificar se o token é válido
- [ ] Verificar se você tem permissão para publicar
- [ ] Verificar se a versão já existe no npm
- [ ] Verificar logs do GitHub Actions

### Tag não foi criada

- [ ] Verificar se o workflow completou
- [ ] Verificar permissões do GitHub Actions
- [ ] Criar tag manualmente se necessário:
  ```bash
  git tag v1.0.0
  git push --tags
  ```

## 📚 Recursos Úteis

- [ ] Ler [RELEASE.md](../RELEASE.md)
- [ ] Ler [RELEASE_QUICK_GUIDE.md](./RELEASE_QUICK_GUIDE.md)
- [ ] Ler [AUTOMATION_SUMMARY.md](./AUTOMATION_SUMMARY.md)
- [ ] Bookmark [Changesets Docs](https://github.com/changesets/changesets)
- [ ] Bookmark [GitHub Actions Docs](https://docs.github.com/en/actions)

## ✨ Dicas

1. **Sempre teste localmente** antes de fazer push
2. **Revise o Release PR** cuidadosamente
3. **Use mensagens descritivas** nos changesets
4. **Siga semantic versioning** ao escolher o tipo
5. **Mantenha o CHANGELOG limpo** e organizado

## 🎉 Pronto!

Quando todos os itens estiverem marcados, seu sistema de release automatizado estará funcionando!

Para fazer um release:

```bash
pnpm changeset
git add .
git commit -m "feat: add new feature"
git push origin main
```

E pronto! O resto é automático! 🚀
