#!/bin/bash
# Script para build da imagem Docker AMD64 em VPS ARM

echo "🔧 Configurando Docker Buildx para AMD64..."

# Criar builder se não existir
if ! docker buildx ls | grep -q "amd64-builder"; then
    docker buildx create --name amd64-builder --platform linux/amd64
fi

# Usar o builder
docker buildx use amd64-builder

# Inicializar o builder
docker buildx inspect --bootstrap

echo "🏗️  Iniciando build da imagem AMD64..."

# Build da imagem
docker buildx build \
    --platform linux/amd64 \
    --load \
    -t hytale-server:latest \
    .

echo "✅ Build concluído! Use 'docker-compose up -d' para iniciar o servidor."
