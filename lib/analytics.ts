// Amplitude analytics wrapper. Fire-and-forget telemetry for agent invocations.
import amplitude from 'amplitude-js';

let initialized = false;

function ensureInit() {
  if (initialized || typeof window === 'undefined') return;
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) return;
  amplitude.getInstance().init(apiKey);
  initialized = true;
}

export function trackAgentInvocation(userId: string, task: string) {
  ensureInit();
  if (!initialized) return;
  amplitude.getInstance().logEvent('agent_invocation', {
    user_id: userId,
    task_length: task.length,
  });
}
