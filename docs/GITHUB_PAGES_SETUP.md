# 🌐 GitHub Pages Setup - Demo App

Este guia explica como configurar e fazer deploy do demo app no GitHub Pages.

## 📋 Configuração Inicial (Uma vez)

### 1. Habilitar GitHub Pages

1. Vá no seu repositório no GitHub
2. Acesse **Settings** → **Pages**
3. Em **Source**, selecione:
   - Source: **GitHub Actions**
4. Clique em **Save**

### 2. Ajustar Base Path (Se necessário)

Se o nome do seu repositório for diferente de `react-html-content-editor`, ajuste em:

**`packages/demo/vite.config.ts`:**

```typescript
base: process.env.NODE_ENV === "production" ? "/SEU-REPO-AQUI/" : "/",
```

Substitua `SEU-REPO-AQUI` pelo nome do seu repositório.

## 🚀 Deploy Automático

### Quando o Deploy Acontece

O deploy é automático quando:

- ✅ Você faz push para `main`
- ✅ Há mudanças em `packages/demo/**` ou `packages/library/**`
- ✅ Você executa manualmente o workflow

### Fluxo de Deploy

```
1. Push para main
   ↓
2. GitHub Actions detecta mudanças
   ↓
3. Build da library
   ↓
4. Build do demo
   ↓
5. Deploy para GitHub Pages
   ↓
6. Site disponível em: https://seu-usuario.github.io/react-html-content-editor/
```

## 🔧 Deploy Manual

### Via GitHub Actions

1. Vá em **Actions** no GitHub
2. Selecione **Deploy Demo to GitHub Pages**
3. Clique em **Run workflow**
4. Selecione a branch `main`
5. Clique em **Run workflow**

### Via Linha de Comando

```bash
# Build local
pnpm build:demo

# Os arquivos estarão em packages/demo/dist/
# Para testar localmente:
cd packages/demo/dist
python -m http.server 8000
# Acesse: http://localhost:8000
```

## 🌍 URL do Demo

Após o deploy, seu demo estará disponível em:

```
https://SEU-USUARIO.github.io/react-html-content-editor/
```

Substitua:

- `SEU-USUARIO` pelo seu username do GitHub
- `react-html-content-editor` pelo nome do seu repositório

## 📝 Estrutura de Arquivos

```
packages/demo/
├── dist/                    # Build output (gerado)
├── public/
│   └── .nojekyll           # Desabilita Jekyll
├── src/
│   ├── examples/           # Exemplos do demo
│   ├── App.tsx            # App principal
│   └── main.tsx           # Entry point
└── vite.config.ts         # Configuração do Vite
```

## ⚙️ Configuração do Vite

**`packages/demo/vite.config.ts`:**

```typescript
export default defineConfig({
  plugins: [react()],
  // Base path para GitHub Pages
  base:
    process.env.NODE_ENV === "production" ? "/react-html-content-editor/" : "/",
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "terser",
  },
});
```

## 🔍 Verificar Deploy

### 1. Status do Workflow

1. Vá em **Actions** no GitHub
2. Veja o workflow **Deploy Demo to GitHub Pages**
3. Verifique se está verde (✅)

### 2. Acessar o Site

1. Vá em **Settings** → **Pages**
2. Veja a URL do site publicado
3. Clique para acessar

### 3. Verificar Logs

Se houver problemas:

1. **Actions** → Selecione o workflow que falhou
2. Clique no job que falhou
3. Veja os logs detalhados

## 🐛 Troubleshooting

### Página 404

**Problema:** Ao acessar a URL, aparece 404.

**Soluções:**

1. Verifique se o GitHub Pages está habilitado
2. Verifique se o workflow completou com sucesso
3. Aguarde alguns minutos (pode demorar até 10 minutos)
4. Limpe o cache do navegador

### Assets não carregam

**Problema:** CSS/JS não carregam, console mostra 404.

**Solução:**

1. Verifique o `base` no `vite.config.ts`
2. Deve ser: `"/nome-do-repo/"`
3. Rebuild e redeploy

### Workflow falha no build

**Problema:** Build falha no GitHub Actions.

**Soluções:**

1. Teste o build localmente: `pnpm build:demo`
2. Verifique os logs do GitHub Actions
3. Certifique-se de que todas as dependências estão no `package.json`

### Mudanças não aparecem

**Problema:** Fiz mudanças mas o site não atualizou.

**Soluções:**

1. Verifique se o workflow rodou
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Aguarde alguns minutos
4. Verifique se fez push para `main`

## 🎨 Customização

### Adicionar Domínio Customizado

1. **Settings** → **Pages**
2. Em **Custom domain**, adicione seu domínio
3. Configure DNS do seu domínio:
   ```
   CNAME: seu-usuario.github.io
   ```

### Adicionar Google Analytics

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

### Adicionar Meta Tags para SEO

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

## 📊 Monitoramento

### Ver Estatísticas

1. **Insights** → **Traffic**
2. Veja visitantes, views, referrers

### Ver Deploys

1. **Actions** → **Deploy Demo to GitHub Pages**
2. Veja histórico de deploys

## 🔄 Atualizar Demo

```bash
# 1. Fazer mudanças no demo
vim packages/demo/src/App.tsx

# 2. Testar localmente
pnpm dev

# 3. Commit e push
git add .
git commit -m "feat: update demo"
git push origin main

# 4. Deploy automático acontece!
```

## ✅ Checklist de Deploy

Antes do primeiro deploy:

- [ ] GitHub Pages habilitado (Source: GitHub Actions)
- [ ] Base path correto no `vite.config.ts`
- [ ] `.nojekyll` existe em `packages/demo/public/`
- [ ] Workflow `deploy-demo.yml` existe
- [ ] Build local funciona: `pnpm build:demo`

Após o deploy:

- [ ] Workflow completou com sucesso
- [ ] Site acessível na URL
- [ ] Assets carregam corretamente
- [ ] Navegação funciona
- [ ] Exemplos funcionam

## 🎉 Pronto!

Seu demo está configurado e será atualizado automaticamente a cada push para `main`!

**URL do Demo:**

```
https://seu-usuario.github.io/react-html-content-editor/
```

## 📚 Recursos

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 💡 Dicas

1. **Teste localmente** antes de fazer push
2. **Use branches** para testar mudanças grandes
3. **Monitore os workflows** para detectar problemas cedo
4. **Mantenha o demo atualizado** com as últimas features da library
5. **Adicione exemplos** para mostrar todas as funcionalidades
