# Configuração QEMU para Build AMD64 em VPS ARM

## Problema
Sua VPS tem arquitetura ARM, mas o Hytale downloader só existe para AMD64. Para fazer o build funcionar, precisamos habilitar a emulação QEMU.

## Solução

### 1. Conecte via SSH no servidor Coolify

```bash
ssh seu-usuario@seu-servidor
```

### 2. Execute o comando para instalar QEMU

```bash
docker run --privileged --rm tonistiigi/binfmt --install all
```

### 3. Verifique se funcionou

```bash
# Verificar plataformas disponíveis
docker buildx ls

# Testar emulação AMD64
docker run --rm --platform=linux/amd64 alpine:3.20 uname -m
```

Se o comando acima retornar `x86_64`, a emulação está funcionando!

### 4. Faça o deploy novamente no Coolify

Agora o build AMD64 deve funcionar sem erros.

## Alternativa: Script Automatizado

Você pode usar o script `setup-qemu.sh` incluído neste repositório:

```bash
# No servidor Coolify
chmod +x setup-qemu.sh
./setup-qemu.sh
```

## Notas

- A emulação QEMU persiste após reinicialização do Docker
- O build será mais lento que nativo, mas funcional
- Isso é necessário porque o Hytale downloader só existe para AMD64
