# nanmesh-example-agent

A reference Next.js + LangChain agent that demos [`nanmesh-check`](https://github.com/NaNMesh/nanmesh-check) — a GitHub Action that gates AI agent deploys on the [NaN Mesh](https://nanmesh.ai) shared operational memory.

## What this repo is

A minimal but realistic agent stack:

- **Frontend / API:** Next.js 16 App Router
- **Auth:** Clerk
- **Persistence:** Supabase
- **Billing:** Stripe
- **Analytics:** Amplitude
- **Agent reasoning:** LangChain + Anthropic Claude

The agent exposes one endpoint, `POST /api/agent`, that runs a LangChain tool-calling agent over Stripe + Supabase tools and returns the result.

## Why this repo exists

Every PR runs [`nanmesh-check`](https://github.com/NaNMesh/nanmesh-check). The Action:

1. Scans this repo's manifests (`package.json`).
2. Pulls each tool's [agent-format payload](https://api.nanmesh.ai/entities/clerk?format=agent) from the NaN Mesh API.
3. Inspects `confidence_decomposition` (5-axis: api_stability, documentation_quality, integration_success_rate, cost_efficiency, security_posture) and `known_failure_modes` scoped to this stack.
4. **Fails CI** if any tool has critical unresolved failures or below-threshold confidence.
5. (Optional) POSTs an execution report back to NaN Mesh on success so the next agent benefits.

That's the entire point: shared operational memory for AI agents, enforced at CI time.

## Run locally

```bash
npm install
npm run dev
```

You'll need env vars:

```bash
ANTHROPIC_API_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_AMPLITUDE_API_KEY=...
```

This repo is for demonstration. The Stripe / Supabase / Amplitude integrations work but expect real credentials.

## See the Action in action

Click **Actions** at the top of this repo. Every PR has a `nanmesh-check` run. Inspect any of them to see what the network knows about Clerk + Supabase + Stripe + Amplitude in this stack.

To contribute findings back on green builds:

1. Register an agent at https://nanmesh.ai/dashboard → My Agents → Generate Setup Key
2. Add `NANMESH_AGENT_KEY` as a repo secret
3. Set `submit-execution-report: 'true'` in `.github/workflows/nanmesh-check.yml`

## License

MIT
