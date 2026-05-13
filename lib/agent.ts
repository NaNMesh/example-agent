// LangChain agent that ties the tools together. Uses Anthropic Claude as the
// reasoning model (via @langchain/anthropic) — the underlying tools are
// Stripe (payment lookups), Supabase (user/data persistence), and Amplitude
// (analytics). The agent picks which tool to invoke based on the task.

import { ChatAnthropic } from '@langchain/anthropic';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { stripeLookupTool } from './tools/stripe-lookup';
import { supabaseQueryTool } from './tools/supabase-query';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-5';

export async function runAgent(task: string): Promise<string> {
  const llm = new ChatAnthropic({
    model: MODEL,
    temperature: 0,
  });

  const tools = [stripeLookupTool, supabaseQueryTool];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      'You are an assistant that helps users query their billing and account data. Use the tools when needed. Be terse.',
    ],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);

  const agent = await createToolCallingAgent({ llm, tools, prompt });
  const executor = new AgentExecutor({ agent, tools });

  const result = await executor.invoke({ input: task });
  return typeof result.output === 'string' ? result.output : JSON.stringify(result.output);
}
