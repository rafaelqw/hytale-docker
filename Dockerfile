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

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jre-alpine

RUN apk add --no-cache tini libstdc++ gcompat unzip && \
    adduser -D -u 1000 -h /server hytale

COPY --from=build /app/hytale-server /app/hytale /usr/local/bin/
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

CMD ["sh", "-c", "if [ -d /server-init ] && [ ! -f /server/.initialized ]; then cp -r /server-init/* /server/ && touch /server/.initialized; fi && exec hytale-server"]

STOPSIGNAL SIGTERM