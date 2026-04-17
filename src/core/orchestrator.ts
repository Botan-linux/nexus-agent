import { Agent, AgentDef } from './agent.js';

const ROUTING: { keywords: string[]; agentId: string }[] = [
  { keywords: ['kod','code','proje','project','build','api','debug','fix','bug','react','next','web','uygulama','server','backend','frontend','python','typescript','javascript','app','geliştir'], agentId: 'cortex' },
  { keywords: ['security','güvenlik','vuln','hack','pentest','ctf','scan','exploit','nmap','siber','zaafiyet','port','tarama','burp','payload'], agentId: 'shield' },
  { keywords: ['youtube','video','senaryo','script','thumbnail','içerik','content','blog','seo','social','tweet','post','kanal'], agentId: 'creator' },
  { keywords: ['freelance','iş bul','müşteri','teklif','proposal','upwork','fiverr','para','bütçe','gelir','client','başvur'], agentId: 'freelance' },
  { keywords: ['öğren','learn','ders','kurs','araştır','research','study','not','tutorial','paper','eğitim','makale','kaynak'], agentId: 'learn' },
  { keywords: ['deploy','sunucu','server','docker','ci/cd','publish','kurulum','setup','vps','devops','nginx','linux','hosting'], agentId: 'deploy' },
];

export class Orchestrator {
  private agents = new Map<string, Agent>();
  private log: { agent: string; task: string; time: number; ok: boolean }[] = [];

  register(def: AgentDef) {
    this.agents.set(def.id, new Agent(def));
  }

  get(id: string) { return this.agents.get(id); }

  list() { return [...this.agents.keys()]; }

  async run(agentId: string, task: string) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent yok: ${agentId}`);
    const r = await agent.run(task);
    this.log.push({ agent: agentId, task, time: r.time, ok: r.success });
    return r;
  }

  async auto(task: string) {
    const id = this.route(task);
    console.log(`  → ${this.get(id)!.emoji} ${this.get(id)!.name} seçildi`);
    return { agent: id, ...(await this.run(id, task)) };
  }

  stats() {
    const total = this.log.length;
    const ok = this.log.filter(l => l.ok).length;
    return { total, success: ok, failed: total - ok, rate: total ? Math.round(ok/total*100) : 0 };
  }

  private route(task: string): string {
    const low = task.toLowerCase();
    let best = 'cortex', bestScore = 0;
    for (const r of ROUTING) {
      let s = 0;
      for (const kw of r.keywords) if (low.includes(kw)) s++;
      if (s > bestScore) { bestScore = s; best = r.agentId; }
    }
    return best;
  }
}
