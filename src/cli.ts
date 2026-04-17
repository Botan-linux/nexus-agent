#!/usr/bin/env node
import { Orchestrator } from './core/orchestrator.js';
import { cortex, shield, creator, freelance, learn, deploy } from './agents/defs.js';

const orchestrator = new Orchestrator();

// Agentları kaydet
orchestrator.register(cortex);
orchestrator.register(shield);
orchestrator.register(creator);
orchestrator.register(freelance);
orchestrator.register(learn);
orchestrator.register(deploy);

// CLI args parse
const args = process.argv.slice(2);
const cmd = args[0];

const HELP = `
nexus-agent v1.0.0
Botan için çalışan otonom AI agent sistemi

KULLANIM:
  node src/cli.ts run <agent> <görev>    Belirli agent'a görev ver
  node src/cli.ts auto <görev>           Otomatik agent seçimi
  node src/cli.ts list                   Agent listesi
  node src/cli.ts stats                  İstatistikler
  node src/cli.ts help                   Bu yardım

AGENTLAR:
  cortex     💻 Senior Developer
  shield     🛡️ Cybersecurity Expert
  creator    🎬 Content Strategist
  freelance  💼 Business Development
  learn      📚 Research & Education
  deploy     🚀 DevOps Engineer
`;

function printBanner() {
  console.log('');
  console.log('  ╔══════════════════════════════╗');
  console.log('  ║     NEXUS AGENT v1.0.0        ║');
  console.log('  ║   Patron: Botan              ║');
  console.log('  ╚══════════════════════════════╝');
  console.log('');
}

async function main() {
  if (!cmd || cmd === 'help') {
    printBanner();
    console.log(HELP);
    return;
  }

  if (cmd === 'list') {
    printBanner();
    console.log('  Agentlar:\n');
    for (const id of orchestrator.list()) {
      const a = orchestrator.get(id)!;
      console.log(`    ${a.emoji} ${a.name.padEnd(12)} ${a.role}`);
    }
    console.log('');
    return;
  }

  if (cmd === 'stats') {
    const s = orchestrator.stats();
    console.log(`\n  Toplam: ${s.total} | Başarılı: ${s.success} | Başarısız: ${s.failed} | Oran: %${s.rate}\n`);
    return;
  }

  if (cmd === 'run') {
    const agentId = args[1];
    const task = args.slice(2).join(' ');
    if (!agentId || !task) {
      console.log('  ❌ Kullanım: node src/cli.ts run <agent> <görev>');
      return;
    }
    printBanner();
    const agent = orchestrator.get(agentId);
    if (!agent) {
      console.log(`  ❌ Agent bulunamadı: ${agentId}`);
      console.log(`  Mevcut: ${orchestrator.list().join(', ')}`);
      return;
    }
    console.log(`  ${agent.emoji} ${agent.name} çalışıyor...\n`);
    const r = await orchestrator.run(agentId, task);
    console.log(`\n${r.output}\n`);
    console.log(`  ⏱ ${(r.time / 1000).toFixed(1)}s | ${r.success ? '✅ Başarılı' : '❌ Başarısız'}\n`);
    return;
  }

  if (cmd === 'auto') {
    const task = args.slice(1).join(' ');
    if (!task) {
      console.log('  ❌ Kullanım: node src/cli.ts auto <görev>');
      return;
    }
    printBanner();
    console.log(`  Görev: ${task}\n`);
    const r = await orchestrator.auto(task);
    console.log(`\n${r.output}\n`);
    console.log(`  ⏱ ${(r.time / 1000).toFixed(1)}s | ${r.success ? '✅ Başarılı' : '❌ Başarısız'}\n`);
    return;
  }

  // Varsayılan: komutu "auto" olarak kabul et
  const task = args.join(' ');
  if (task) {
    printBanner();
    console.log(`  Görev: ${task}\n`);
    const r = await orchestrator.auto(task);
    console.log(`\n${r.output}\n`);
    console.log(`  ⏱ ${(r.time / 1000).toFixed(1)}s | ${r.success ? '✅ Başarılı' : '❌ Başarısız'}\n`);
    return;
  }

  console.log(HELP);
}

main().catch(console.error);
