import { NextResponse } from 'next/server';
import { Orchestrator } from '@/orchestrator';
import type { LLMConfig } from '@/types';

// Persistent orchestrator instance (survives hot reloads in dev)
let orch: Orchestrator | null = null;

function getOrchestrator(): Orchestrator {
  if (!orch) {
    const config: Partial<LLMConfig> = {
      provider: 'zai',
      apiKey: process.env.OPENAI_API_KEY,
    };
    orch = new Orchestrator(config);
  }
  return orch;
}

export async function POST(req: Request) {
  try {
    const { messages, agent } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const orch = getOrchestrator();
    const lastMsg = messages[messages.length - 1];
    const task = typeof lastMsg === 'string' ? lastMsg : lastMsg.content;

    let result;
    let selectedAgent = agent || 'auto';

    if (agent && agent !== 'auto') {
      result = await orch.run(agent, task);
    } else {
      const autoResult = await orch.auto(task);
      result = autoResult.result;
      selectedAgent = autoResult.agent;
    }

    return NextResponse.json({
      content: result.output,
      agent: selectedAgent,
      time: result.time,
      provider: result.provider,
      model: result.model,
      success: result.success,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
