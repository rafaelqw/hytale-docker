<div align="center">

# 🎮 Hytale Docker Server

**Production-ready Docker container for Hytale dedicated servers**

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/r/romariin/hytale-docker)
[![Java](https://img.shields.io/badge/Java-25-ED8B00?logo=openjdk&logoColor=white)](https://adoptium.net)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Automated authentication • Auto-updates • Secure by default*

</div>

---

## ✨ Features

- 🚀 **One-command startup** — Just `docker compose up`, authenticate once, play forever
- 🔐 **Automated OAuth2** — Device code flow with 30-day persistent tokens
- 🔄 **Auto-updates** — Downloads and updates server files automatically
- 🔒 **Secure by default** — Non-root user, dropped capabilities, hardened container
- ⚡ **Fast boot** — AOT cache support for quicker server startup
- 📦 **Persistent data** — Worlds, mods, and logs survive container restarts

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/romariin/hytale-docker.git
cd hytale-docker/examples

# Start the server
docker compose up -d

# Watch for authentication prompt
docker compose logs -f
```

On first run, you'll see a device authorization prompt. Visit the URL, enter the code, and authorize. The server starts automatically.

Connect to your server at `your-ip:5520` using the Hytale client.

> **Note:** Hytale uses **QUIC over UDP** (not TCP). Forward UDP port 5520 on your firewall.

---

## 📖 Documentation

Full documentation is available in the `docs/` folder. To run it locally:

```bash
cd docs
npm install
npm run dev
```

Topics covered:
- Quick Start Guide
- Configuration
- Authentication
- Network Setup
- Security
- Troubleshooting

---

## 🏗️ Development

```bash
# Build the image locally
docker build -t hytale-server:latest .

# Run the documentation site
cd docs
npm install
npm run dev
```

---

## 📚 References

- [Hytale Server Manual](https://support.hytale.com/hc/en-us/articles/45326769420827-Hytale-Server-Manual)
- [Server Provider Authentication Guide](https://support.hytale.com/hc/en-us/articles/45328341414043-Server-Provider-Authentication-Guide)

---

<div align="center">

**Made with ❤️ for the Hytale community**

[Report Bug](https://github.com/romariin/hytale-docker/issues) •
[Request Feature](https://github.com/romariin/hytale-docker/issues)

</div>