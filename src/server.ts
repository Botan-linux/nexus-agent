/**
 * Nexus Agent — Built-in HTTP Server
 * Serves Web UI + REST API for agent interaction
 */

import http from 'http';
import { URL } from 'url';
import { Orchestrator } from './orchestrator.js';
import type { LLMConfig, Message } from './types.js';

// ─── EMBEDDED WEB UI ────────────────────────────────────
const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nexus Agent</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#050810;--surface:#0a0f1a;--card:#111827;--border:#1e293b;--text:#e2e8f0;--muted:#64748b;--accent:#00e5cc;--accent2:#06b6d4}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);height:100vh;display:flex;overflow:hidden}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}::-webkit-scrollbar-thumb:hover{background:var(--accent)}

/* Sidebar */
.sidebar{width:240px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;transition:width .3s}
.sidebar.collapsed{width:0;overflow:hidden}
.sidebar-header{padding:16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
.sidebar-header .logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:15px}
.sidebar-header .logo .icon{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:14px}
.sidebar-header .logo span:last-child{color:var(--accent)}
.sidebar-nav{flex:1;padding:12px;overflow-y:auto}
.sidebar-nav .label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);padding:8px 12px 6px}
.agent-btn{width:100%;text-align:left;padding:10px 12px;border:none;background:none;color:var(--text);font-size:13px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all .2s;margin-bottom:2px}
.agent-btn:hover{background:rgba(255,255,255,.05)}
.agent-btn.active{background:rgba(0,229,204,.1);color:var(--accent)}
.agent-btn .emoji{font-size:18px;width:28px;text-align:center}
.agent-btn .info{flex:1}
.agent-btn .name{font-weight:600;font-size:13px}
.agent-btn .role{font-size:10px;color:var(--muted)}
.sidebar-footer{padding:12px;border-top:1px solid var(--border)}
.provider-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:12px;font-size:11px;background:rgba(0,229,204,.08);color:var(--accent);border:1px solid rgba(0,229,204,.15)}

/* Main */
.main{flex:1;display:flex;flex-direction:column;min-width:0}
.topbar{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;background:rgba(10,15,26,.5);backdrop-filter:blur(10px)}
.toggle-btn{background:none;border:none;color:var(--muted);cursor:pointer;padding:4px;font-size:18px;line-height:1}
.toggle-btn:hover{color:var(--text)}
.topbar-info{display:flex;align-items:center;gap:8px;flex:1}
.topbar-info .emoji{font-size:20px}
.topbar-info .agent-name{font-weight:600;font-size:14px}
.status-badge{padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.status-active{background:rgba(16,185,129,.1);color:#10b981;border:1px solid rgba(16,185,129,.2)}
.topbar-actions{display:flex;gap:8px}
.topbar-actions button{background:none;border:1px solid var(--border);color:var(--muted);padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer}
.topbar-actions button:hover{color:var(--text);border-color:var(--accent)}

/* Messages */
.messages{flex:1;overflow-y:auto;padding:24px 20px}
.welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center}
.welcome .icon-wrap{width:64px;height:64px;border-radius:20px;background:rgba(0,229,204,.08);display:flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px}
.welcome h2{font-size:20px;font-weight:700;margin-bottom:8px}
.welcome p{color:var(--muted);font-size:13px;max-width:400px;line-height:1.6;margin-bottom:24px}
.suggestions{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:500px}
.suggestion{padding:8px 14px;border-radius:20px;border:1px solid var(--border);color:var(--muted);font-size:12px;cursor:pointer;transition:all .2s;background:none}
.suggestion:hover{border-color:rgba(0,229,204,.3);color:var(--accent)}
.msg{display:flex;gap:12px;margin-bottom:20px;animation:fadeIn .3s}
.msg.user{flex-direction:row-reverse}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.msg-avatar{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.msg.user .msg-avatar{background:var(--accent);color:#000;border-radius:10px 10px 4px 10px}
.msg.assistant .msg-avatar{background:rgba(0,229,204,.1)}
.msg-bubble{max-width:70%;padding:12px 16px;font-size:13px;line-height:1.7;border-radius:16px;white-space:pre-wrap;word-wrap:break-word}
.msg.user .msg-bubble{background:var(--accent);color:#000;border-bottom-right-radius:4px}
.msg.assistant .msg-bubble{background:var(--card);color:var(--text);border-bottom-left-radius:4px}
.msg-bubble code{background:rgba(0,0,0,.3);padding:1px 5px;border-radius:4px;font-family:'SF Mono',Monaco,monospace;font-size:12px}
.msg-bubble pre{background:rgba(0,0,0,.4);padding:12px;border-radius:8px;overflow-x:auto;margin:8px 0;font-size:12px;line-height:1.5}
.msg-meta{font-size:10px;color:var(--muted);margin-top:4px}
.typing{display:flex;gap:12px;margin-bottom:20px}
.typing .msg-avatar{width:32px;height:32px;border-radius:10px;background:rgba(0,229,204,.1);display:flex;align-items:center;justify-content:center;font-size:16px}
.typing-dots{background:var(--card);padding:14px 18px;border-radius:16px;border-bottom-left-radius:4px;display:flex;gap:5px}
.typing-dots span{width:7px;height:7px;background:var(--muted);border-radius:50%;animation:dot 1.4s infinite}
.typing-dots span:nth-child(2){animation-delay:.2s}
.typing-dots span:nth-child(3){animation-delay:.4s}
@keyframes dot{0%,60%,100%{opacity:.3;transform:scale(.8)}30%{opacity:1;transform:scale(1)}}

/* Input */
.input-area{padding:16px 20px;border-top:1px solid var(--border);background:rgba(10,15,26,.5);backdrop-filter:blur(10px)}
.input-wrap{display:flex;gap:10px;max-width:720px;margin:0 auto}
.input-wrap input{flex:1;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;transition:border-color .2s}
.input-wrap input:focus{border-color:rgba(0,229,204,.4)}
.input-wrap input::placeholder{color:var(--muted)}
.send-btn{width:44px;height:44px;border-radius:12px;border:none;background:var(--accent);color:#000;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:all .2s}
.send-btn:hover{background:var(--accent2);transform:scale(1.05)}
.send-btn:disabled{opacity:.4;cursor:not-allowed;transform:none}

/* Responsive */
@media(max-width:640px){.sidebar{position:fixed;left:0;top:0;height:100%;z-index:100}.sidebar.collapsed{width:0}}
</style>
</head>
<body>
<div class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <div class="logo"><div class="icon">⚡</div><span>Nexus</span><span style="color:var(--accent)">Agent</span></div>
  </div>
  <div class="sidebar-nav">
    <div class="label">Agents</div>
    <div id="agentList"></div>
  </div>
  <div class="sidebar-footer">
    <div class="label">Provider</div>
    <div id="providerBadge" class="provider-badge"></div>
  </div>
</div>
<div class="main">
  <div class="topbar">
    <button class="toggle-btn" onclick="toggleSidebar()">☰</button>
    <div class="topbar-info">
      <span class="emoji" id="topEmoji">🧠</span>
      <span class="agent-name" id="topName">Auto</span>
      <span class="status-badge status-active">active</span>
    </div>
    <div class="topbar-actions">
      <button onclick="clearChat()">Clear</button>
    </div>
  </div>
  <div class="messages" id="messages">
    <div class="welcome" id="welcome">
      <div class="icon-wrap">⚡</div>
      <h2>Nexus Agent</h2>
      <p>Autonomous multi-agent AI system. Give a task, the right agent is automatically selected.</p>
      <div class="suggestions">
        <button class="suggestion" onclick="useSuggestion(this)">Write a Python port scanner</button>
        <button class="suggestion" onclick="useSuggestion(this)">List cybersecurity tools</button>
        <button class="suggestion" onclick="useSuggestion(this)">Create YouTube video script</button>
        <button class="suggestion" onclick="useSuggestion(this)">Explain Docker networking</button>
      </div>
    </div>
  </div>
  <div class="input-area">
    <div class="input-wrap">
      <input type="text" id="input" placeholder="Message Auto..." onkeydown="if(event.key==='Enter')send()" autocomplete="off">
      <button class="send-btn" id="sendBtn" onclick="send()">➤</button>
    </div>
  </div>
</div>
<script>
const AGENTS=[
  {id:'cortex',name:'Cortex',emoji:'💻',role:'Developer'},
  {id:'shield',name:'Shield',emoji:'🛡️',role:'Security'},
  {id:'creator',name:'Creator',emoji:'🎬',role:'Content'},
  {id:'freelance',name:'Freelance',emoji:'💼',role:'Business'},
  {id:'learn',name:'Learn',emoji:'📚',role:'Research'},
  {id:'deploy',name:'Deploy',emoji:'🚀',role:'DevOps'},
  {id:'auto',name:'Auto',emoji:'🧠',role:'Smart Router'}
];
let activeAgent='auto';
let chatHistory=[];

function init(){
  const list=document.getElementById('agentList');
  list.innerHTML=AGENTS.map(a=>
    '<button class="agent-btn'+(a.id===activeAgent?' active':'')+'" data-id="'+a.id+'" onclick="selectAgent(\\''+a.id+'\\')">'+
    '<span class="emoji">'+a.emoji+'</span>'+
    '<div class="info"><div class="name">'+a.name+'</div><div class="role">'+a.role+'</div></div>'+
    '</button>'
  ).join('');
  document.getElementById('providerBadge').textContent='● Connected';
}

function selectAgent(id){
  activeAgent=id;
  const a=AGENTS.find(x=>x.id===id);
  document.getElementById('topEmoji').textContent=a.emoji;
  document.getElementById('topName').textContent=a.name;
  document.getElementById('input').placeholder='Message '+a.name+'...';
  document.querySelectorAll('.agent-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.id===id);
  });
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('collapsed');
}

function clearChat(){
  chatHistory=[];
  document.getElementById('messages').innerHTML='<div class="welcome" id="welcome"><div class="icon-wrap">⚡</div><h2>Nexus Agent</h2><p>Autonomous multi-agent AI system. Give a task, the right agent is automatically selected.</p><div class="suggestions"><button class="suggestion" onclick="useSuggestion(this)">Write a Python port scanner</button><button class="suggestion" onclick="useSuggestion(this)">List cybersecurity tools</button><button class="suggestion" onclick="useSuggestion(this)">Create YouTube video script</button><button class="suggestion" onclick="useSuggestion(this)">Explain Docker networking</button></div></div>';
}

function useSuggestion(el){
  document.getElementById('input').value=el.textContent;
  send();
}

async function send(){
  const input=document.getElementById('input');
  const text=input.value.trim();
  if(!text)return;
  input.value='';
  const msgs=document.getElementById('messages');
  const welcome=document.getElementById('welcome');
  if(welcome)welcome.remove();

  // User message
  msgs.innerHTML+='<div class="msg user"><div class="msg-avatar">👤</div><div><div class="msg-bubble">'+escHtml(text)+'</div></div></div>';
  chatHistory.push({role:'user',content:text});
  msgs.scrollTop=msgs.scrollHeight;

  // Typing
  const typingEl=document.createElement('div');
  typingEl.className='typing';
  typingEl.innerHTML='<div class="msg-avatar">🧠</div><div class="typing-dots"><span></span><span></span><span></span></div>';
  msgs.appendChild(typingEl);
  msgs.scrollTop=msgs.scrollHeight;
  document.getElementById('sendBtn').disabled=true;

  try{
    const res=await fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({messages:chatHistory,agent:activeAgent})
    });
    const data=await res.json();
    if(data.error)throw new Error(data.error);

    const a=AGENTS.find(x=>x.id===(data.agent||activeAgent));
    const selected=data.agent||activeAgent;
    if(selected!==activeAgent)selectAgent(selected);

    typingEl.remove();
    msgs.innerHTML+='<div class="msg assistant"><div class="msg-avatar">'+(a?a.emoji:'🧠')+'</div><div><div class="msg-bubble">'+escHtml(data.content)+'</div><div class="msg-meta">'+(a?a.name+' · ':'')+(data.time?(data.time/1000).toFixed(1)+'s':'')+'</div></div></div>';
    chatHistory.push({role:'assistant',content:data.content});
  }catch(e){
    typingEl.remove();
    msgs.innerHTML+='<div class="msg assistant"><div class="msg-avatar">⚠️</div><div><div class="msg-bubble" style="color:#f87171">'+escHtml(e.message)+'</div></div></div>';
  }
  msgs.scrollTop=msgs.scrollHeight;
  document.getElementById('sendBtn').disabled=false;
}

function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\\n/g,'<br>');}

init();
</script>
</body>
</html>`;

// ─── REQUEST PARSER ─────────────────────────────────────
function parseBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

// ─── SERVER ─────────────────────────────────────────────
export function startServer(port: number = 3000, llm?: Partial<LLMConfig>) {
  const orch = new Orchestrator(llm);

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://localhost:${port}`);

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    try {
      // ─── Web UI ──────────────────────────────────
      if (url.pathname === '/' || url.pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(HTML_PAGE);
        return;
      }

      // ─── API: Chat ───────────────────────────────
      if (url.pathname === '/api/chat' && req.method === 'POST') {
        const body = await parseBody(req);
        const { messages, agent } = body;

        if (!messages || messages.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No messages provided' }));
          return;
        }

        const lastMsg = messages[messages.length - 1];
        const task = typeof lastMsg === 'string' ? lastMsg : lastMsg.content;

        const t0 = Date.now();
        let result;

        if (agent && agent !== 'auto') {
          result = await orch.run(agent, task);
        } else {
          const autoResult = await orch.auto(task);
          result = autoResult.result;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          content: result.output,
          agent: agent || 'auto',
          time: result.time,
          provider: result.provider,
          model: result.model,
          success: result.success,
        }));
        return;
      }

      // ─── API: List Agents ────────────────────────
      if (url.pathname === '/api/agents' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(orch.list()));
        return;
      }

      // ─── API: Stats ──────────────────────────────
      if (url.pathname === '/api/stats' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(orch.stats()));
        return;
      }

      // ─── API: Provider ───────────────────────────
      if (url.pathname === '/api/provider' && req.method === 'POST') {
        const body = await parseBody(req);
        const { provider } = body;
        if (!['zai', 'openai', 'ollama', 'anthropic'].includes(provider)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid provider. Use: zai, openai, ollama, anthropic' }));
          return;
        }
        orch.setProvider({ provider });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, provider }));
        return;
      }

      // ─── 404 ─────────────────────────────────────
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    } catch (e: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  });

  server.listen(port, () => {
    console.log(`
  ╔══════════════════════════════════════╗
  ║     Nexus Agent Web UI Running       ║
  ║  http://localhost:${port}              ║
  ╚══════════════════════════════════════╝
  `);
  });

  return server;
}
