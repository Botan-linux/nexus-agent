import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(req: Request) {
  try {
    const { messages, agent } = await req.json();

    const agentPrompts: Record<string, string> = {
      cortex: 'Sen NexusAI\'nin Cortex kodlusun. Botan\'ın baş geliştiricisisin. Türkçe konuş. Çalışan kod ver.',
      shield: 'Sen NexusAI\'nin Shield isimli siber güvenlik uzmanısın. Botan için çalışıyorsun. Türkçe konuş.',
      creator: 'Sen NexusAI\'nin Creator isimli içerik üreticisisin. Botan için çalışıyorsun. Türkçe konuş.',
      freelance: 'Sen NexusAI\'nin Freelance isimli iş geliştirme uzmanısın. Botan için çalışıyorsun. Türkçe konuş.',
      learn: 'Sen NexusAI\'nin Learn isimli araştırmacısın. Botan için çalışıyorsun. Türkçe konuş.',
      deploy: 'Sen NexusAI\'nin Deploy isimli DevOps mühendisisin. Botan için çalışıyorsun. Türkçe konuş.',
      auto: 'Sen NexusAI\'nin çok amaçlı AI asistanısın. Botan için çalışıyorsun. Türkçe konuş.',
    };

    const systemPrompt = agentPrompts[agent || 'auto'] || agentPrompts.auto;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    const content = completion.choices[0]?.message?.content || 'Yanıt alınamadı.';

    return NextResponse.json({ content, agent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
