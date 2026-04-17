/**
 * Multi-provider LLM Support
 * z-ai-web-dev-sdk, OpenAI, Ollama, Anthropic
 */

import type { Message, LLMConfig, TaskResult } from '../types.js';

export interface Provider {
  name: string;
  chat(messages: Message[], config?: Partial<LLMConfig>): Promise<{ content: string; model: string; tokens?: { prompt: number; completion: number } }>;
}

// ─── ZAI Provider (built-in) ────────────────────────────
class ZAIProvider implements Provider {
  name = 'zai';
  private zai: any = null;

  async init() {
    if (!this.zai) {
      const mod = await import('z-ai-web-dev-sdk');
      this.zai = await mod.ZAI.create();
    }
  }

  async chat(messages: Message[]) {
    await this.init();
    const res = await this.zai.chat.completions.create({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });
    return {
      content: res.choices[0]?.message?.content || '',
      model: 'zai-default',
    };
  }
}

// ─── OpenAI Provider ────────────────────────────────────
class OpenAIProvider implements Provider {
  name = 'openai';

  async chat(messages: Message[], config?: Partial<LLMConfig>) {
    const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;
    const model = config?.model || 'gpt-4o';
    const baseUrl = config?.baseUrl || 'https://api.openai.com/v1';

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: 4096 }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return {
      content: data.choices[0]?.message?.content || '',
      model: data.model,
      tokens: data.usage ? {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
      } : undefined,
    };
  }
}

// ─── Ollama Provider (Local Models) ─────────────────────
class OllamaProvider implements Provider {
  name = 'ollama';

  async chat(messages: Message[], config?: Partial<LLMConfig>) {
    const baseUrl = config?.baseUrl || 'http://localhost:11434';
    const model = config?.model || 'llama3';

    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    return {
      content: data.message?.content || '',
      model: data.model,
      tokens: data.prompt_eval_count ? {
        prompt: data.prompt_eval_count,
        completion: data.eval_count,
      } : undefined,
    };
  }
}

// ─── Anthropic Provider ─────────────────────────────────
class AnthropicProvider implements Provider {
  name = 'anthropic';

  async chat(messages: Message[], config?: Partial<LLMConfig>) {
    const apiKey = config?.apiKey || process.env.ANTHROPIC_API_KEY;
    const model = config?.model || 'claude-sonnet-4-20250514';

    // Anthropic wants system prompt separate
    const systemMsg = messages.find(m => m.role === 'system');
    const chatMsgs = messages.filter(m => m.role !== 'system');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: systemMsg?.content || '',
        messages: chatMsgs,
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return {
      content: data.content?.[0]?.text || '',
      model: data.model,
      tokens: data.usage ? {
        prompt: data.usage.input_tokens,
        completion: data.usage.output_tokens,
      } : undefined,
    };
  }
}

// ─── Factory ────────────────────────────────────────────
const providers = new Map<string, Provider>();

function registerProvider(id: string, provider: Provider) {
  providers.set(id, provider);
}

// Register built-in providers
registerProvider('zai', new ZAIProvider());
registerProvider('openai', new OpenAIProvider());
registerProvider('ollama', new OllamaProvider());
registerProvider('anthropic', new AnthropicProvider());

export function createProvider(config: LLMConfig): Provider {
  return providers.get(config.provider) || providers.get('zai')!;
}

export { registerProvider };
