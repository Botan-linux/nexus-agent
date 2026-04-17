'use client'

import { useState, useRef } from 'react'
import {
  Send, Terminal, Globe, Layers, Lock, Zap,
  Brain, Shield, Code, Film, Briefcase, BookOpen, Rocket,
  ChevronRight, Copy, Check, Sparkles, ArrowRight,
  Monitor, Download, Cpu, Webhook
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// ─── STARS BACKGROUND ───────────────────────────────────
function Stars() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 7}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.1 + Math.random() * 0.4,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,204,0.03)_0%,transparent_70%)]" />
    </div>
  )
}

// ─── COPY BUTTON ────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#00e5cc] transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

// ─── INSTALL SECTION ────────────────────────────────────
function InstallSection() {
  const installCmd = 'curl -fsSL https://raw.githubusercontent.com/Botan-linux/nexus-agent/main/install.sh | bash'
  const npmCmd = 'npm install -g nexus-agent'
  const sourceCmd = 'git clone https://github.com/Botan-linux/nexus-agent.git && cd nexus-agent && npm install && npm run cli:serve'

  return (
    <section className="relative z-10 py-20 px-6" id="install">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-[#00e5cc]/20 text-[#00e5cc] mb-4">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Quick Install
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Get Started in Seconds</h2>
          <p className="text-zinc-400">One command. That&apos;s it. Nexus Agent works out of the box.</p>
        </div>

        <div className="space-y-4">
          {/* Primary: curl */}
          <Card className="bg-[#0a0f1a]/80 border-[#00e5cc]/20 glow">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[#00e5cc] text-black text-xs font-semibold">Recommended</Badge>
                <span className="text-sm text-zinc-400">Script install</span>
              </div>
              <div className="relative bg-black/40 rounded-lg p-4 font-mono text-sm">
                <span className="text-emerald-400">$</span>
                <span className="text-zinc-300 ml-2">{installCmd}</span>
                <CopyBtn text={installCmd} />
              </div>
            </div>
          </Card>

          {/* npm */}
          <Card className="bg-[#0a0f1a]/80 border-border/50">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-zinc-300">npm</span>
                <span className="text-xs text-zinc-600">Global install</span>
              </div>
              <div className="relative bg-black/40 rounded-lg p-4 font-mono text-sm">
                <span className="text-emerald-400">$</span>
                <span className="text-zinc-300 ml-2">{npmCmd}</span>
                <CopyBtn text={npmCmd} />
              </div>
            </div>
          </Card>

          {/* Source */}
          <Card className="bg-[#0a0f1a]/80 border-border/50">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-zinc-300">From Source</span>
                <span className="text-xs text-zinc-600">Development</span>
              </div>
              <div className="relative bg-black/40 rounded-lg p-4 font-mono text-sm text-zinc-400 overflow-x-auto">
                <div><span className="text-emerald-400">$</span> git clone https://github.com/Botan-linux/nexus-agent.git</div>
                <div><span className="text-emerald-400">$</span> cd nexus-agent</div>
                <div><span className="text-emerald-400">$</span> npm install</div>
                <div><span className="text-emerald-400">$</span> npm run cli:serve</div>
                <CopyBtn text={sourceCmd} />
              </div>
            </div>
          </Card>
        </div>

        {/* Requirements */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-500">
          <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4" /> macOS / Linux</span>
          <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4" /> Node.js 18+</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> No extra deps</span>
        </div>
      </div>
    </section>
  )
}

// ─── FEATURES ──────────────────────────────────────────
function Features() {
  const features = [
    { icon: Terminal, title: 'Terminal CLI', desc: 'Interactive chat mode with agent routing, task execution, and smart auto-routing. Just type and go.', color: '#00e5cc' },
    { icon: Globe, title: 'Web UI', desc: 'Built-in chat interface accessible from your browser. Run "nexus serve" and open localhost:3000.', color: '#06b6d4' },
    { icon: Layers, title: 'Multi-Provider', desc: 'Z.ai, OpenAI, Anthropic, Ollama — switch freely between LLM providers with one command.', color: '#8b5cf6' },
    { icon: Lock, title: 'Local Models', desc: 'Run Ollama locally for full privacy. No cloud dependency. Your data stays on your machine.', color: '#10b981' },
    { icon: Webhook, title: 'API Support', desc: 'REST API endpoints for chat, agent management, and stats. Integrate with any tool.', color: '#f59e0b' },
    { icon: Brain, title: 'Smart Routing', desc: 'Auto-detects the best agent for your task based on keyword analysis. Or pick one manually.', color: '#ec4899' },
  ]

  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Everything You Need</h2>
          <p className="text-zinc-400 max-w-lg mx-auto">A complete AI agent system with terminal, web, and API interfaces. Built for developers who ship.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <Card key={f.title} className="bg-[#0a0f1a]/80 border-border/50 backdrop-blur-sm hover:border-border transition-colors group">
              <div className="p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}10` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold mb-2 text-base">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── AGENTS ────────────────────────────────────────────
function Agents() {
  const agents = [
    { id: 'cortex', name: 'Cortex', emoji: '💻', role: 'Senior Developer', desc: 'Full-stack development, debugging, code review, and architecture design.' },
    { id: 'shield', name: 'Shield', emoji: '🛡️', role: 'Cybersecurity Expert', desc: 'Security audits, pentesting, vulnerability analysis, and tool recommendations.' },
    { id: 'creator', name: 'Creator', emoji: '🎬', role: 'Content Strategist', desc: 'YouTube scripts, SEO optimization, social media, and content calendars.' },
    { id: 'freelance', name: 'Freelance', emoji: '💼', role: 'Business Development', desc: 'Job research, proposals, pricing strategy, and client management.' },
    { id: 'learn', name: 'Learn', emoji: '📚', role: 'Research & Education', desc: 'Deep research, learning paths, note-taking, and resource curation.' },
    { id: 'deploy', name: 'Deploy', emoji: '🚀', role: 'DevOps Engineer', desc: 'Docker, CI/CD, server setup, deployment strategies, and cloud ops.' },
  ]

  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Six Specialized Agents</h2>
          <p className="text-zinc-400 max-w-lg mx-auto">Each agent is an expert in its domain. The smart router picks the best one automatically, or you can choose manually.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(a => (
            <Card key={a.id} className="bg-[#0a0f1a]/80 border-border/50 backdrop-blur-sm hover:border-[#00e5cc]/20 transition-colors">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{a.emoji}</div>
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-xs text-zinc-500">{a.role}</div>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">{a.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── USAGE DEMO ────────────────────────────────────────
function UsageDemo() {
  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">How It Works</h2>
          <p className="text-zinc-400">Three ways to interact. Same powerful engine.</p>
        </div>

        <div className="space-y-6">
          {/* Terminal Demo */}
          <Card className="bg-[#0a0f1a]/80 border-border/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-2 text-xs text-zinc-500">Terminal — nexus chat</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-2">
              <div><span className="text-emerald-400">$</span> <span className="text-zinc-300">nexus chat</span></div>
              <div className="text-zinc-600">  ╔══════════════════════════════════════╗</div>
              <div className="text-zinc-600">  ║          NEXUS AGENT v1.0.0          ║</div>
              <div className="text-zinc-600">  ╚══════════════════════════════════════╝</div>
              <div className="mt-2"><span className="text-[#00e5cc]">🧠 →</span> <span className="text-zinc-300">Write a Python port scanner</span></div>
              <div className="text-zinc-500">  [💻 Cortex selected]</div>
              <div className="text-zinc-300">  Here&apos;s an asynchronous Python port scanner...</div>
              <div className="text-zinc-600 mt-1">  ⏱ 3.2s | zai:zai-default | ✅</div>
            </div>
          </Card>

          {/* Web UI Demo */}
          <Card className="bg-[#0a0f1a]/80 border-border/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500">Web UI — localhost:3000</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00e5cc]/10 flex items-center justify-center text-sm">👤</div>
                <div className="bg-[#00e5cc] text-black px-4 py-2.5 rounded-2xl rounded-br-sm text-sm max-w-[70%]">Explain Docker networking</div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00e5cc]/10 flex items-center justify-center text-sm">🚀</div>
                <div className="bg-[#111827] px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm text-zinc-300 max-w-[70%]">
                  Docker networking allows containers to communicate... <span className="text-zinc-600 text-xs ml-2">Deploy · 2.1s</span>
                </div>
              </div>
            </div>
          </Card>

          {/* API Demo */}
          <Card className="bg-[#0a0f1a]/80 border-border/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
              <Webhook className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500">REST API</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-3">
              <div><span className="text-emerald-400">$</span> <span className="text-zinc-300">nexus serve 3000</span></div>
              <div className="text-zinc-500"># API endpoints available:</div>
              <div className="text-zinc-400">POST <span className="text-[#00e5cc]">/api/chat</span>     <span className="text-zinc-600">— Send messages to agents</span></div>
              <div className="text-zinc-400">GET  <span className="text-[#00e5cc]">/api/agents</span>   <span className="text-zinc-600">— List available agents</span></div>
              <div className="text-zinc-400">GET  <span className="text-[#00e5cc]">/api/stats</span>    <span className="text-zinc-600">— View statistics</span></div>
              <div className="text-zinc-400">POST <span className="text-[#00e5cc]">/api/provider</span> <span className="text-zinc-600">— Switch LLM provider</span></div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

// ─── MAIN ──────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-[#050810]">
      <Stars />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5cc] to-[#06b6d4] flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight">Nexus<span className="text-[#00e5cc]">Agent</span></span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/Botan-linux/nexus-agent" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </Button>
          </a>
          <a href="#install">
            <Button size="sm" className="bg-[#00e5cc] hover:bg-[#00c4b0] text-black font-semibold">
              Install <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex items-center justify-center px-6 py-20 sm:py-32">
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00e5cc]/20 bg-[#00e5cc]/5 text-[#00e5cc] text-sm mb-8">
            <Sparkles className="w-3.5 h-3.5" /> Open Source — MIT License — v1.0.0
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
            The AI That<br /><span className="gradient-text">Works For You</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl mx-auto">
            Autonomous multi-agent system for development, cybersecurity, content creation, and more.
            Terminal CLI, Web UI, multi-provider LLM, local model support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#install">
              <Button size="lg" className="bg-[#00e5cc] hover:bg-[#00c4b0] text-black font-semibold text-base px-8 glow w-full sm:w-auto">
                Install Now <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
            <a href="https://github.com/Botan-linux/nexus-agent" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:border-[#00e5cc]/50 text-base px-8 w-full sm:w-auto">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </main>

      <InstallSection />
      <Features />
      <Agents />
      <UsageDemo />

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#00e5cc]" />
                <span className="font-semibold text-sm">Nexus Agent</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">Autonomous multi-agent AI system. Built for developers who want AI that actually does things.</p>
            </div>
            <div>
              <div className="text-sm font-semibold mb-3">Quick Links</div>
              <div className="space-y-2 text-sm text-zinc-500">
                <a href="#install" className="block hover:text-[#00e5cc] transition-colors">Installation</a>
                <a href="https://github.com/Botan-linux/nexus-agent" className="block hover:text-[#00e5cc] transition-colors">GitHub Repository</a>
                <a href="https://github.com/Botan-linux/nexus-agent/blob/main/README.md" className="block hover:text-[#00e5cc] transition-colors">Documentation</a>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-3">Commands</div>
              <div className="space-y-2 text-sm text-zinc-500 font-mono">
                <div>nexus chat</div>
                <div>nexus serve</div>
                <div>nexus run &lt;agent&gt; &lt;task&gt;</div>
                <div>nexus auto &lt;task&gt;</div>
              </div>
            </div>
          </div>
          <Separator className="mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
            <span>MIT License — Built with ❤️ by Botan</span>
            <span>Nexus Agent v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
