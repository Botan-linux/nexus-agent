#!/usr/bin/env node

import { Orchestrator } from './orchestrator.js';
import { startServer } from './server.js';
import type { LLMConfig } from './types.js';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// ─── BANNER ─────────────────────────────────────────────
function banner() {
  console.log(`
  ╔══════════════════════════════════════╗
  ║          NEXUS AGENT v1.0.0          ║
  ║    Autonomous Multi-Agent System     ║
  ║          Patron: Botan               ║
  ╚══════════════════════════════════════╝
  `);
}

function help() {
  banner();
  console.log(`KULLANIM:
  nexus chat                    Interaktif chat modu
  nexus serve [port]            Web UI sunucusu başlat (varsayılan: 3000)
  nexus run <agent> <görev>     Belirli agent'a görev ver
  nexus auto <görev>            Otomatik agent seçimi
  nexus provider <name>         Provider değiştir (zai/openai/ollama/anthropic)
  nexus config                  Yapılandırma göster/düzenle
  nexus list                    Agent listesi
  nexus stats                   İstatistikler
  nexus help                    Bu yardım

PROVIDER'LAR:
  zai        (varsayılan)   Z.ai SDK
  openai     OpenAI API     (OPENAI_API_KEY gerekli)
  anthropic  Anthropic API  (ANTHROPIC_API_KEY gerekli)
  ollama     Local Model    (localhost:11434)

AGENT'LAR:
  💻 cortex     Senior Developer
  🛡️ shield     Cybersecurity Expert
  🎬 creator    Content Strategist
  💼 freelance  Business Development
  📚 learn      Research & Education
  🚀 deploy     DevOps Engineer

WEB UI:
  nexus serve             → http://localhost:3000
  nexus serve 8080        → http://localhost:8080`);
}

// ─── CONFIG ─────────────────────────────────────────────
const CONFIG_DIR = join(homedir(), '.nexus-agent');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

interface NexusConfig {
  provider: LLMConfig['provider'];
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  ollamaUrl?: string;
}

function getConfig(): NexusConfig {
  try {
    if (existsSync(CONFIG_FILE)) {
      return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch {}
  return { provider: 'zai' };
}

function saveConfig(config: NexusConfig) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// ─── MAIN ───────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const config = getConfig();
  const orch = new Orchestrator(config);

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') { help(); return; }

  if (cmd === 'list') {
    banner();
    for (const a of orch.list()) {
      console.log(`  ${a.emoji} ${a.name.padEnd(12)} ${a.role}`);
    }
    console.log('');
    return;
  }

  if (cmd === 'stats') {
    const s = orch.stats();
    console.log(`  Toplam: ${s.total} | Başarılı: ${s.success} | Başarısız: ${s.failed} | Oran: %${s.rate}`);
    return;
  }

  if (cmd === 'config') {
    banner();
    console.log(`  Config: ~/.nexus-agent/config.json`);
    console.log(`  Provider: ${config.provider}`);
    if (config.model) console.log(`  Model: ${config.model}`);
    if (config.baseUrl) console.log(`  Base URL: ${config.baseUrl}`);
    if (config.ollamaUrl) console.log(`  Ollama URL: ${config.ollamaUrl}`);

    const action = args[1];
    if (action === 'set') {
      const key = args[2];
      const value = args[3];
      if (!key || !value) {
        console.log('\n  Kullanım: nexus config set <key> <value>');
        console.log('  Keys: provider, model, apiKey, baseUrl, ollamaUrl');
        return;
      }
      (config as any)[key] = value;
      saveConfig(config);
      console.log(`  ✓ ${key} = ${value}`);
    }
    return;
  }

  if (cmd === 'provider') {
    const name = args[1];
    if (!name || !['zai', 'openai', 'ollama', 'anthropic'].includes(name)) {
      console.log('  Provider: zai | openai | ollama | anthropic');
      return;
    }
    orch.setProvider({ provider: name as LLMConfig['provider'] });
    config.provider = name as LLMConfig['provider'];
    saveConfig(config);
    console.log(`  ✓ Provider: ${name}`);
    return;
  }

  if (cmd === 'serve') {
    banner();
    const port = parseInt(args[1] || '3000', 10);
    startServer(port, config);
    return;
  }

  if (cmd === 'run') {
    const agentId = args[1];
    const task = args.slice(2).join(' ');
    if (!agentId || !task) { console.log('  ❌ nexus run <agent> <görev>'); return; }
    const agent = orch.get(agentId);
    if (!agent) { console.log(`  ❌ Agent yok: ${agentId}`); return; }
    banner();
    console.log(`  ${agent.config.emoji} ${agent.config.name} çalışıyor...\n`);
    const r = await orch.run(agentId, task);
    console.log(`${r.output}\n`);
    console.log(`  ⏱ ${(r.time / 1000).toFixed(1)}s | ${r.provider}:${r.model} | ${r.success ? '✅' : '❌'}`);
    return;
  }

  if (cmd === 'auto') {
    const task = args.slice(1).join(' ');
    if (!task) { console.log('  ❌ nexus auto <görev>'); return; }
    banner();
    const r = await orch.auto(task);
    const agent = orch.get(r.agent)!;
    console.log(`  ${agent.config.emoji} ${agent.config.name} seçildi\n`);
    console.log(`${r.result.output}\n`);
    console.log(`  ⏱ ${(r.result.time / 1000).toFixed(1)}s | ${r.result.provider}:${r.result.model} | ${r.result.success ? '✅' : '❌'}`);
    return;
  }

  if (cmd === 'chat') {
    banner();
    console.log('  Chat modu — "exit" veya "çık" ile çık, "agent:<id>" ile agent değiştir\n');

    let currentAgent: string | null = null;

    const readline = await import('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const prompt = () => {
      const label = currentAgent ? `${orch.get(currentAgent)!.config.emoji} ` : '  ';
      rl.question(`${label}→ `, async (line: string) => {
        const input = line.trim();
        if (!input) { prompt(); return; }
        if (input === 'exit' || input === 'çık') { console.log('\n  Görüşürüz! 🚀\n'); rl.close(); return; }
        if (input === 'help') { console.log('  agent:<id> → agent değiştir | exit → çık | görev yaz → çalıştır'); prompt(); return; }
        if (input.startsWith('agent:')) {
          const id = input.split(':')[1];
          if (orch.get(id)) { currentAgent = id; console.log(`  → ${orch.get(id)!.config.emoji} ${orch.get(id)!.config.name}`); }
          else { console.log(`  ❌ Agent yok: ${id}`); }
          prompt(); return;
        }

        try {
          let r;
          if (currentAgent) {
            r = await orch.run(currentAgent, input);
            console.log(`  [${orch.get(currentAgent)!.config.emoji} ${orch.get(currentAgent)!.config.name}]\n`);
          } else {
            r = await orch.auto(input);
            console.log(`  [${orch.get(r.agent)!.config.emoji} ${orch.get(r.agent)!.config.name} seçildi]\n`);
          }
          console.log(`  ${r.result.output}\n`);
          console.log(`  ⏱ ${(r.result.time / 1000).toFixed(1)}s | ${r.result.success ? '✅' : '❌'}\n`);
        } catch (e: any) {
          console.log(`  ❌ ${e.message}\n`);
        }
        prompt();
      });
    };
    prompt();
    return;
  }

  // Varsayılan: auto
  const task = args.join(' ');
  if (task) {
    banner();
    const r = await orch.auto(task);
    console.log(`  ${orch.get(r.agent)!.config.emoji} ${orch.get(r.agent)!.config.name} seçildi\n`);
    console.log(`${r.result.output}\n`);
    console.log(`  ⏱ ${(r.result.time / 1000).toFixed(1)}s | ${r.result.success ? '✅' : '❌'}`);
    return;
  }

  help();
}

main().catch(console.error);
