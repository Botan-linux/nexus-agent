'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send, Bot, Terminal, ChevronDown, Star,
  Shield, Code, Film, Briefcase, BookOpen, Rocket, Brain,
  Zap, Lock, Globe, Layers, MessageSquare, Sparkles, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

// ─── TYPES ──────────────────────────────────────────────
interface Message { role: 'user' | 'assistant'; content: string; agent?: string }
interface Agent { id: string; name: string; emoji: string; role: string; status: string }

const AGENT_LIST: Agent[] = [
  { id: 'cortex', name: 'Cortex', emoji: '💻', role: 'Developer', status: 'active' },
  { id: 'shield', name: 'Shield', emoji: '🛡️', role: 'Security', status: 'active' },
  { id: 'creator', name: 'Creator', emoji: '🎬', role: 'Content', status: 'active' },
  { id: 'freelance', name: 'Freelance', emoji: '💼', role: 'Business', status: 'active' },
  { id: 'learn', name: 'Learn', emoji: '📚', role: 'Research', status: 'active' },
  { id: 'deploy', name: 'Deploy', emoji: '🚀', role: 'DevOps', status: 'active' },
  { id: 'auto', name: 'Auto', emoji: '🧠', role: 'Smart Router', status: 'active' },
]

// ─── STARS BACKGROUND ───────────────────────────────────
function Stars() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 7}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.1 + Math.random() * 0.5,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,204,0.03)_0%,transparent_70%)]" />
    </div>
  )
}

// ─── HERO / LANDING ─────────────────────────────────────
function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Stars />
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5cc] to-[#06b6d4] flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight">Nexus<span className="text-[#00e5cc]">Agent</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white" asChild>
            <a href="https://github.com/Botan-linux/nexus-agent" target="_blank"><svg className="w-4 h-4 mr-1.5 inline" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>GitHub</a>
          </Button>
          <Button size="sm" className="bg-[#00e5cc] hover:bg-[#00c4b0] text-black font-semibold" onClick={onEnter}>
            <MessageSquare className="w-4 h-4 mr-1.5" />Launch
          </Button>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00e5cc]/20 bg-[#00e5cc]/5 text-[#00e5cc] text-sm mb-8">
            <Sparkles className="w-3.5 h-3.5" /> Open Source — MIT License
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
            The AI That<br /><span className="gradient-text">Works For You</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl mx-auto">
            Autonomous multi-agent system for development, cybersecurity, content creation, and more.
            Terminal CLI, Web UI, multi-provider LLM support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#00e5cc] hover:bg-[#00c4b0] text-black font-semibold text-base px-8 glow" onClick={onEnter}>
              Try Web UI <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:border-[#00e5cc]/50 text-base px-8" asChild>
              <a href="https://github.com/Botan-linux/nexus-agent" target="_blank">
                <svg className="w-5 h-5 mr-2 inline" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Terminal, title: 'Terminal CLI', desc: 'Interactive chat mode, agent routing, task execution' },
              { icon: Globe, title: 'Web UI', desc: 'Chat with agents, manage tasks from your browser' },
              { icon: Layers, title: 'Multi-Provider', desc: 'Z.ai, OpenAI, Anthropic, Ollama — switch freely' },
              { icon: Lock, title: 'Local First', desc: 'Run Ollama locally, no cloud dependency required' },
            ].map(f => (
              <Card key={f.title} className="bg-[#0a0f1a]/80 border-border/50 backdrop-blur-sm">
                <div className="p-5">
                  <f.icon className="w-5 h-5 text-[#00e5cc] mb-3" />
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-zinc-500">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Agents */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">Six Specialized Agents</h2>
          <p className="text-zinc-500 mb-10">Each agent is an expert in its domain. Auto-routing picks the best one.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {AGENT_LIST.filter(a => a.id !== 'auto').map(a => (
              <Card key={a.id} className="bg-[#0a0f1a]/80 border-border/50 backdrop-blur-sm hover:border-[#00e5cc]/30 transition-colors">
                <div className="p-4 text-center">
                  <div className="text-3xl mb-2">{a.emoji}</div>
                  <div className="font-semibold text-sm">{a.name}</div>
                  <div className="text-xs text-zinc-500">{a.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00e5cc]" />
            <span className="text-sm text-zinc-500">Nexus Agent v1.0.0 — MIT License</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500 text-sm">
            <a href="https://github.com/Botan-linux/nexus-agent" className="hover:text-[#00e5cc] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── WEB UI (Chat Interface) ────────────────────────────
function WebUI({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeAgent, setActiveAgent] = useState('auto')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user' as const, content: text }], agent: activeAgent }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages(prev => [...prev, { role: 'assistant', content: data.content, agent: data.agent }])
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Hata: ${e.message}` }])
    }
    setLoading(false)
  }, [input, loading, messages, activeAgent])

  return (
    <div className="h-screen flex bg-[#050810]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden transition-all duration-300 bg-[#0a0f1a] border-r border-border/30 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-border/30">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00e5cc]" />
            <span className="font-semibold text-sm">Nexus Agent</span>
          </div>
          <button onClick={onBack} className="text-zinc-500 hover:text-white text-xs">← Site</button>
        </div>
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="text-xs text-zinc-600 mb-2 px-2">AGENTS</div>
          {AGENT_LIST.map(a => (
            <button
              key={a.id}
              onClick={() => setActiveAgent(a.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors flex items-center gap-2 ${activeAgent === a.id ? 'bg-[#00e5cc]/10 text-[#00e5cc]' : 'text-zinc-400 hover:bg-white/5'}`}
            >
              <span>{a.emoji}</span>
              <span>{a.name}</span>
              <span className="text-xs text-zinc-600 ml-auto">{a.role}</span>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-border/30">
          <div className="text-xs text-zinc-600 mb-1">PROVIDER</div>
          <Badge variant="outline" className="border-[#00e5cc]/20 text-[#00e5cc] text-xs">Z.ai (default)</Badge>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-[#0a0f1a]/50 backdrop-blur-sm">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-500 hover:text-white">
            {sidebarOpen ? <ChevronDown className="w-4 h-4 rotate-90" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2">
            <span>{AGENT_LIST.find(a => a.id === activeAgent)?.emoji}</span>
            <span className="font-medium text-sm">{AGENT_LIST.find(a => a.id === activeAgent)?.name}</span>
            <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 text-xs">active</Badge>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white text-xs" onClick={() => { setMessages([]); }}>
              Clear
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#00e5cc]/10 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-[#00e5cc]" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Nexus Agent</h2>
              <p className="text-zinc-500 text-sm mb-6 max-w-md">
                AI agent sistemi. Görev ver, doğru agent otomatik seçilir.<br />
                Sol panelden agent değiştirebilirsin.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {['Python port tarayıcı yaz', 'Siber güvenlik araçları listele', 'YouTube video senaryosu oluştur', 'npx ile kullanımı göster'].map(s => (
                  <button key={s} onClick={() => { setInput(s) }} className="px-3 py-1.5 rounded-full border border-border/50 text-xs text-zinc-400 hover:border-[#00e5cc]/30 hover:text-[#00e5cc] transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 mb-6 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#00e5cc]/10 flex items-center justify-center shrink-0 text-sm">
                  {m.agent ? AGENT_LIST.find(a => a.id === m.agent)?.emoji : '🧠'}
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[#00e5cc] text-black rounded-br-sm'
                  : 'bg-[#111827] text-zinc-300 rounded-bl-sm'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 mb-6">
              <div className="w-7 h-7 rounded-lg bg-[#00e5cc]/10 flex items-center justify-center shrink-0 text-sm animate-pulse">🧠</div>
              <div className="bg-[#111827] rounded-2xl px-4 py-3 rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-border/30 bg-[#0a0f1a]/50 backdrop-blur-sm">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={`Message ${AGENT_LIST.find(a => a.id === activeAgent)?.name}...`}
              className="bg-[#111827] border-border/50 text-zinc-300 placeholder:text-zinc-600 focus:border-[#00e5cc]/50"
              disabled={loading}
            />
            <Button onClick={send} disabled={loading || !input.trim()} className="bg-[#00e5cc] hover:bg-[#00c4b0] text-black px-5">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ───────────────────────────────────────────────
export default function Home() {
  const [view, setView] = useState<'landing' | 'app'>('landing')
  return view === 'landing' ? <LandingPage onEnter={() => setView('app')} /> : <WebUI onBack={() => setView('landing')} />
}
