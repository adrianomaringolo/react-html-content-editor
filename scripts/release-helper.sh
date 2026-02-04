#!/bin/bash

# Release Helper Script
# Este script ajuda no processo de release

set -e

echo "🚀 React HTML Content Editor - Release Helper"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Verificar se está na branch main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    print_color $RED "⚠️  Você não está na branch main!"
    print_color $YELLOW "Branch atual: $current_branch"
    read -p "Deseja continuar mesmo assim? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar se há mudanças não commitadas
if [[ -n $(git status -s) ]]; then
    print_color $RED "⚠️  Há mudanças não commitadas!"
    git status -s
    read -p "Deseja continuar mesmo assim? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Menu principal
echo ""
print_color $BLUE "Escolha uma opção:"
echo "1) Criar um novo changeset"
echo "2) Ver status dos changesets"
echo "3) Aplicar changesets (atualizar versões)"
echo "4) Build e publicar (manual)"
echo "5) Ver último release"
echo "6) Sair"
echo ""

read -p "Opção: " option

case $option in
    1)
        print_color $GREEN "📝 Criando novo changeset..."
        pnpm changeset
        echo ""
        print_color $GREEN "✅ Changeset criado!"
        print_color $YELLOW "Próximos passos:"
        echo "  1. git add ."
        echo "  2. git commit -m 'chore: add changeset'"
        echo "  3. git push origin main"
        echo "  4. GitHub Actions criará um Release PR automaticamente"
        ;;
    2)
        print_color $GREEN "📊 Status dos changesets:"
        pnpm changeset status
        ;;
    3)
        print_color $YELLOW "⚠️  Isso atualizará as versões localmente."
        read -p "Continuar? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_color $GREEN "📦 Aplicando changesets..."
            pnpm changeset version
            print_color $GREEN "✅ Versões atualizadas!"
            print_color $YELLOW "Não esqueça de commitar as mudanças:"
            echo "  git add ."
            echo "  git commit -m 'chore: version packages'"
            echo "  git push origin main"
        fi
        ;;
    4)
        print_color $YELLOW "⚠️  Isso publicará no npm AGORA!"
        print_color $YELLOW "Certifique-se de que:"
        echo "  - Você tem permissão para publicar"
        echo "  - NPM_TOKEN está configurado"
        echo "  - Todos os testes estão passando"
        echo ""
        read -p "Continuar? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_color $GREEN "🏗️  Building..."
            pnpm build
            print_color $GREEN "📦 Publicando..."
            pnpm changeset publish
            print_color $GREEN "✅ Publicado com sucesso!"
            print_color $YELLOW "Não esqueça de fazer push das tags:"
            echo "  git push --follow-tags"
        fi
        ;;
    5)
        print_color $GREEN "📋 Último release:"
        git describe --tags --abbrev=0 2>/dev/null || echo "Nenhuma tag encontrada"
        echo ""
        print_color $GREEN "📝 Últimos commits:"
        git log --oneline -5
        ;;
    6)
        print_color $BLUE "👋 Até logo!"
        exit 0
        ;;
    *)
        print_color $RED "❌ Opção inválida!"
        exit 1
        ;;
esac
