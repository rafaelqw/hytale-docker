#!/bin/bash
# Script para habilitar QEMU no servidor Coolify (VPS ARM)
# Execute este script no servidor via SSH

echo "🔧 Habilitando emulação QEMU para AMD64 em ARM..."

# Instalar QEMU e binfmt
docker run --privileged --rm tonistiigi/binfmt --install all

echo ""
echo "✅ QEMU instalado com sucesso!"
echo ""
echo "📋 Verificando plataformas disponíveis:"
docker buildx ls

echo ""
echo "🎯 Testando emulação AMD64:"
docker run --rm --platform=linux/amd64 alpine:3.20 uname -m

echo ""
echo "✅ Configuração completa! Agora você pode fazer o build AMD64 no Coolify."
echo "   Execute o deploy novamente no Coolify."
