# Setup para Build Local

## Preparação

Antes de fazer o build da imagem Docker, você precisa extrair os arquivos do servidor:

```bash
# Criar diretório para os arquivos extraídos
mkdir -p /home/ubuntu/arquivos/hytale/extracted

# Extrair o conteúdo do zip
unzip /home/ubuntu/arquivos/hytale/2026.01.28-87d03be09.zip -d /home/ubuntu/arquivos/hytale/extracted
```

Os arquivos extraídos serão montados no container durante a execução.

## Build e Execução

Com os arquivos extraídos, você pode fazer o build e executar o servidor:

```bash
# Build da imagem para ARM64
docker-compose build

# Executar o servidor
docker-compose up -d

# Ver logs
docker-compose logs -f hytale
```

## Como Funciona

1. O Dockerfile faz o build apenas dos binários necessários (hytale-server e hytale)
2. Os arquivos do servidor são montados via volume do diretório `/home/ubuntu/arquivos/hytale/extracted`
3. Na primeira execução, os arquivos são copiados para o volume persistente `/server`
4. Um arquivo `.initialized` é criado para evitar sobrescrever dados em reinicializações

## Notas

- O diretório `/home/ubuntu/arquivos/hytale/extracted` deve conter os arquivos extraídos do servidor
- O build é feito especificamente para arquitetura ARM64
- Os arquivos do servidor são montados como volume read-only
- A imagem será construída localmente ao invés de baixar do Docker Hub
