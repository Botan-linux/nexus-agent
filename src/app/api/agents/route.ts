import { NextResponse } from 'next/server';

export async function GET() {
  const agents = [
    { id: 'cortex', name: 'Cortex', emoji: '💻', role: 'Senior Developer', status: 'active' },
    { id: 'shield', name: 'Shield', emoji: '🛡️', role: 'Cybersecurity Expert', status: 'active' },
    { id: 'creator', name: 'Creator', emoji: '🎬', role: 'Content Strategist', status: 'active' },
    { id: 'freelance', name: 'Freelance', emoji: '💼', role: 'Business Development', status: 'active' },
    { id: 'learn', name: 'Learn', emoji: '📚', role: 'Research & Education', status: 'active' },
    { id: 'deploy', name: 'Deploy', emoji: '🚀', role: 'DevOps Engineer', status: 'active' },
    { id: 'auto', name: 'Auto', emoji: '🧠', role: 'Smart Router', status: 'active' },
  ];
  return NextResponse.json(agents);
}
