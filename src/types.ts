export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMConfig {
  provider: 'zai' | 'openai' | 'ollama' | 'anthropic';
  model?: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface TaskResult {
  success: boolean;
  output: string;
  time: number;
  provider: string;
  model: string;
  tokens?: { prompt: number; completion: number };
}

export interface AgentConfig {
  id: string;
  name: string;
  emoji: string;
  role: string;
  prompt: string;
  tools?: string[];
}
