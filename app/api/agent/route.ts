// The agent endpoint. POST { task: string } → invoke the LangChain agent.
// Auth: Clerk. Persistence: Supabase. Billing: Stripe. Analytics: Amplitude.
// LLM: Anthropic via @langchain/anthropic.
//
// Keys come from env. This file is illustrative — real production would
// wire request validation, rate limits, and structured error responses.

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { runAgent } from '@/lib/agent';
import { trackAgentInvocation } from '@/lib/analytics';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const task = typeof body?.task === 'string' ? body.task : null;
  if (!task) {
    return NextResponse.json({ error: 'task required' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  await supabase.from('agent_runs').insert({ user_id: userId, task, started_at: new Date().toISOString() });

  trackAgentInvocation(userId, task);

  const result = await runAgent(task);

  await supabase.from('agent_runs').update({ completed_at: new Date().toISOString(), result }).eq('user_id', userId);

  return NextResponse.json({ result });
}
