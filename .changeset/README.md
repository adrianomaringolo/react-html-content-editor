# Changesets

Este diretório contém os changesets pendentes que serão incluídos no próximo release.

## Como criar um changeset

```bash
pnpm changeset
```

Siga as instruções interativas para:

1. Selecionar o package que mudou
2. Escolher o tipo de versão (major, minor, patch)
3. Escrever uma descrição das mudanças

## Tipos de versão

- **major**: Breaking changes (1.0.0 → 2.0.0)
- **minor**: Novas features (1.0.0 → 1.1.0)
- **patch**: Bug fixes (1.0.0 → 1.0.1)

## Exemplos

### Bug Fix

```
---
"react-html-content-editor": patch
---

Fix cursor jumping issue in split view mode
```

### Nova Feature

```
---
"react-html-content-editor": minor
---

Add WYSIWYG toolbar with visual editing capabilities
```

### Breaking Change

```
---
"react-html-content-editor": major
---

BREAKING: Rename 'activeTab' prop to 'defaultView'
```

Para mais informações, veja [RELEASE.md](../RELEASE.md).
