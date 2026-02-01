# ── Build binaries ───────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS build

ARG TARGETARCH
WORKDIR /app

COPY package.json bun.lock* tsconfig.json ./
RUN bun install --frozen-lockfile 2>/dev/null || bun install

COPY src/ src/

RUN BUN_TARGET=$([ "$TARGETARCH" = "arm64" ] && echo "bun-linux-arm64" || echo "bun-linux-x64-baseline") && \
    bun build src/main.ts --compile --target=$BUN_TARGET --outfile=hytale-server && \
    bun build src/hytale.ts --compile --target=$BUN_TARGET --outfile=hytale

# ── Copy server files ────────────────────────────────────────────────────────
FROM alpine:3.20 AS files

ARG TARGETARCH
COPY 2026.01.28-87d03be09.zip /tmp/server-files.zip
RUN apk add --no-cache unzip && \
    unzip -q /tmp/server-files.zip -d /server-files

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jre-alpine

RUN apk add --no-cache tini libstdc++ gcompat unzip && \
    adduser -D -u 1000 -h /server hytale

COPY --from=build /app/hytale-server /app/hytale /usr/local/bin/
COPY --from=files /server-files /server/
RUN chmod +x /usr/local/bin/hytale-server /usr/local/bin/hytale

RUN mkdir -p /server/.hytale/tokens && chown -R hytale:hytale /server

ENV JAVA_OPTS="-Xms4G -Xmx8G" \
    SERVER_PORT=5520 \
    PATCHLINE=release \
    FORCE_UPDATE=false \
    AUTO_UPDATE=false \
    USE_AOT_CACHE=true \
    DISABLE_SENTRY=false \
    AUTO_REFRESH_TOKENS=true \
    AUTOSELECT_GAME_PROFILE=true

WORKDIR /server
VOLUME /server
EXPOSE 5520/udp
USER hytale

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD pgrep -f HytaleServer || exit 1

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["hytale-server"]

STOPSIGNAL SIGTERM