import ZAI from 'z-ai-web-dev-sdk';

export interface TaskResult {
  success: boolean;
  output: string;
  time: number;
}

export interface AgentDef {
  id: string;
  name: string;
  emoji: string;
  role: string;
  prompt: string;
}

export class Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  prompt: string;
  private zai: any = null;

  constructor(def: AgentDef) {
    this.id = def.id;
    this.name = def.name;
    this.emoji = def.emoji;
    this.role = def.role;
    this.prompt = def.prompt;
  }

  async connect() {
    if (!this.zai) this.zai = await ZAI.create();
  }

  async run(task: string): Promise<TaskResult> {
    const t0 = Date.now();
    try {
      await this.connect();
      const res = await this.zai.chat.completions.create({
        messages: [
          { role: 'system', content: this.prompt },
          { role: 'user', content: task },
        ],
      });
      return {
        success: true,
        output: res.choices[0]?.message?.content || 'Yanıt yok',
        time: Date.now() - t0,
      };
    } catch (e: any) {
      return { success: false, output: e.message, time: Date.now() - t0 };
    }
  }
}
