/**
 * Agent — Base class for all AI agents
 */

import type { AgentConfig, TaskResult, LLMConfig, Message } from '../types.js';
import { createProvider } from './providers/index.js';

export class Agent {
  config: AgentConfig;
  llm: LLMConfig;
  history: Message[] = [];
  taskLog: TaskResult[] = [];

  constructor(config: AgentConfig, llm?: Partial<LLMConfig>) {
    this.config = config;
    this.llm = { provider: llm?.provider || 'zai', model: llm?.model, apiKey: llm?.apiKey, baseUrl: llm?.baseUrl };
  }

  async run(task: string): Promise<TaskResult> {
    const t0 = Date.now();
    const provider = createProvider(this.llm);

    const messages: Message[] = [
      { role: 'system', content: this.config.prompt },
      ...this.history,
      { role: 'user', content: task },
    ];

    try {
      const res = await provider.chat(messages, this.llm);
      this.history.push({ role: 'user', content: task });
      this.history.push({ role: 'assistant', content: res.content });

      // Keep last 20 messages for context
      if (this.history.length > 40) this.history = this.history.slice(-40);

      const result: TaskResult = {
        success: true,
        output: res.content,
        time: Date.now() - t0,
        provider: provider.name,
        model: res.model,
        tokens: res.tokens,
      };
      this.taskLog.push(result);
      return result;
    } catch (e: any) {
      const result: TaskResult = {
        success: false,
        output: `Hata: ${e.message}`,
        time: Date.now() - t0,
        provider: provider.name,
        model: this.llm.model || 'unknown',
      };
      this.taskLog.push(result);
      return result;
    }
  }

  stats() {
    const total = this.taskLog.length;
    const ok = this.taskLog.filter(t => t.success).length;
    return { name: this.config.name, role: this.config.role, tasks: total, success: ok, failed: total - ok };
  }
}
