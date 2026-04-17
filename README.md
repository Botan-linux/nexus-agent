# ⚡ Nexus Agent

**Autonomous Multi-Agent AI System** — Development, cybersecurity, content creation, and more. Terminal CLI, Web UI, multi-provider LLM support, and local model capability.

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-00e5cc?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-00e5cc?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/node-18%2B-green?style=flat-square" alt="Node.js" />
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue?style=flat-square" alt="Platform" />
</p>

## ✨ Features

- 🖥️ **Terminal CLI** — Interactive chat mode with agent routing
- 🌐 **Web UI** — Built-in browser interface (`nexus serve`)
- 🤖 **Multi-Provider LLM** — Z.ai, OpenAI, Anthropic, Ollama
- 🔒 **Local Models** — Run Ollama locally, no cloud needed
- 🧠 **Smart Routing** — Auto-detects the best agent for your task
- 📡 **REST API** — Full API for integration with any tool
- ⚙️ **Persistent Config** — `~/.nexus-agent/config.json`

## 📦 Quick Install

### Script (Recommended)
```bash
curl -fsSL https://raw.githubusercontent.com/Botan-linux/nexus-agent/main/install.sh | bash
```

### npm
```bash
npm install -g nexus-agent
```

### From Source
```bash
git clone https://github.com/Botan-linux/nexus-agent.git
cd nexus-agent
npm install
npm run cli:serve
```

## 🚀 Usage

### Terminal CLI
```bash
nexus chat                    # Interactive chat mode
nexus serve                   # Start Web UI (http://localhost:3000)
nexus serve 8080              # Custom port
nexus run cortex "Write a REST API"  # Run specific agent
nexus auto "Scan my network"  # Auto-route to best agent
nexus list                    # List all agents
nexus stats                   # View statistics
nexus config                  # Manage configuration
nexus config set provider ollama  # Change provider
nexus provider openai         # Switch to OpenAI
```

### Web UI
```bash
nexus serve
# Open http://localhost:3000 in your browser
```

### REST API
```bash
nexus serve 3000

# Chat with an agent
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"agent":"cortex"}'

# List agents
curl http://localhost:3000/api/agents

# View stats
curl http://localhost:3000/api/stats

# Switch provider
curl -X POST http://localhost:3000/api/provider \
  -H "Content-Type: application/json" \
  -d '{"provider":"ollama"}'
```

## 🤖 Agents

| Agent | Emoji | Role |
|-------|-------|------|
| **Cortex** | 💻 | Senior Developer — Code, architecture, debugging |
| **Shield** | 🛡️ | Cybersecurity Expert — Pentest, audit, tools |
| **Creator** | 🎬 | Content Strategist — YouTube, SEO, social |
| **Freelance** | 💼 | Business Dev — Jobs, proposals, pricing |
| **Learn** | 📚 | Research & Education — Deep research, paths |
| **Deploy** | 🚀 | DevOps Engineer — Docker, CI/CD, cloud |

Use `auto` to let the system pick the best agent automatically.

## ⚙️ Configuration

Config file: `~/.nexus-agent/config.json`

```json
{
  "provider": "zai",
  "model": null,
  "apiKey": null,
  "baseUrl": null,
  "ollamaUrl": "http://localhost:11434"
}
```

### Environment Variables
```bash
# OpenAI
export OPENAI_API_KEY=sk-...

# Anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# Ollama (local)
export OLLAMA_BASE_URL=http://localhost:11434
export OLLAMA_MODEL=llama3
```

## 🔌 Providers

| Provider | Key Required | Default Model |
|----------|-------------|---------------|
| **Z.ai** | No (built-in) | zai-default |
| **OpenAI** | `OPENAI_API_KEY` | gpt-4o |
| **Anthropic** | `ANTHROPIC_API_KEY` | claude-sonnet-4-20250514 |
| **Ollama** | No (local) | llama3 |

## 🏗️ Build Binary

```bash
npm run build:cli       # Bundle to dist/nexus-cli.mjs
npm run build:binary    # Full binary build with launchers
npm run build:all       # Both steps
```

Output in `dist/`:
- `nexus-cli.mjs` — Bundled CLI
- `nexus` — Unix launcher
- `nexus.cmd` — Windows launcher
- `install.sh` — Installation script

## 📁 Project Structure

```
nexus-agent/
├── src/
│   ├── cli.ts            # CLI entry point
│   ├── server.ts         # HTTP server + embedded Web UI
│   ├── agent.ts          # Agent base class
│   ├── orchestrator.ts   # Multi-agent orchestrator
│   ├── types.ts          # TypeScript types
│   ├── index.ts          # Library exports
│   ├── agents/
│   │   └── defs.ts       # Agent definitions
│   ├── providers/
│   │   └── index.ts      # LLM providers (Z.ai, OpenAI, Ollama, Anthropic)
│   ├── app/              # Next.js marketing website
│   └── components/ui/    # UI components
├── scripts/
│   └── build-binary.js   # Binary build script
├── install.sh            # Installation script
├── package.json
└── README.md
```

## 📄 License

MIT — Botan
