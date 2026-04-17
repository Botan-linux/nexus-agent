/**
 * Orchestrator — Routes tasks to agents, manages the system
 */

import { Agent } from './agent.js';
import type { AgentConfig, TaskResult, LLMConfig } from './types.js';
import { cortex, shield, creator, freelance, learn, deploy } from './agents/defs.js';

const ROUTING: { kw: string[]; id: string }[] = [
  { kw: ['kod','code','proje','project','build','api','debug','fix','bug','react','next','web','uygulama','server','backend','frontend','python','typescript','javascript','app','geliştir','script','plugin','tool','arat'], agentId: 'cortex' },
  { kw: ['security','güvenlik','vuln','hack','pentest','ctf','scan','exploit','nmap','siber','zaafiyet','açık','port','tarama','burp','payload','malware','reverse'], agentId: 'shield' },
  { kw: ['youtube','video','senaryo','script','thumbnail','içerik','content','blog','seo','social','tweet','post','kanal','reels','shorts'], agentId: 'creator' },
  { kw: ['freelance','iş bul','müşteri','teklif','proposal','upwork','fiverr','para','bütçe','gelir','client','başvur','contract'], agentId: 'freelance' },
  { kw: ['öğren','learn','ders','kurs','araştır','research','study','not','tutorial','paper','eğitim','makale','kaynak','path'], agentId: 'learn' },
  { kw: ['deploy','sunucu','server','docker','ci/cd','publish','kurulum','setup','vps','devops','nginx','linux','hosting','aws','cloud'], agentId: 'deploy' },
];

const ALL_AGENTS = [cortex, shield, creator, freelance, learn, deploy];

export class Orchestrator {
  agents = new Map<string, Agent>();
  log: { agent: string; task: string; time: number; ok: boolean }[] = [];
  private defaultLLM: Partial<LLMConfig>;

  constructor(llm?: Partial<LLMConfig>) {
    this.defaultLLM = llm || {};
    for (const def of ALL_AGENTS) {
      this.agents.set(def.id, new Agent(def, this.defaultLLM));
    }
  }

  get(id: string) { return this.agents.get(id); }
  list() { return [...this.agents.values()].map(a => ({ id: a.config.id, name: a.config.name, emoji: a.config.emoji, role: a.config.role })); }

  async run(agentId: string, task: string): Promise<TaskResult> {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent yok: ${agentId}. Mevcut: ${[...this.agents.keys()].join(', ')}`);
    const r = await agent.run(task);
    this.log.push({ agent: agentId, task, time: r.time, ok: r.success });
    return r;
  }

  async auto(task: string): Promise<{ agent: string; result: TaskResult }> {
    const id = this.route(task);
    const agent = this.agents.get(id)!;
    const r = await agent.run(task);
    this.log.push({ agent: id, task, time: r.time, ok: r.success });
    return { agent: id, result: r };
  }

  stats() {
    const total = this.log.length;
    const ok = this.log.filter(l => l.ok).length;
    return { total, success: ok, failed: total - ok, rate: total ? Math.round(ok / total * 100) : 0, agents: [...this.agents.values()].map(a => a.stats()) };
  }

  setProvider(config: Partial<LLMConfig>) {
    for (const agent of this.agents.values()) {
      agent.llm = { ...agent.llm, ...config };
    }
  }

  private route(task: string): string {
    const low = task.toLowerCase();
    let best = 'cortex', bestScore = 0;
    for (const r of ROUTING) {
      let s = 0;
      for (const k of r.kw) if (low.includes(k)) s++;
      if (s > bestScore) { bestScore = s; best = r.id; }
    }
    return best;
  }
}
