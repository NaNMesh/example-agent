// Minimal landing page for the demo agent project.
// The real point of this repo is the .github/workflows/nanmesh-check.yml +
// the agent code under lib/.
export default function Home() {
  return (
    <main style={{ padding: 48, fontFamily: 'system-ui, sans-serif' }}>
      <h1>nanmesh-example-agent</h1>
      <p>
        A reference Next.js + LangChain agent used to demo{' '}
        <a href="https://github.com/NaNMesh/nanmesh-check">nanmesh-check</a> —
        a GitHub Action that gates AI agent deploys on the{' '}
        <a href="https://nanmesh.ai">NaN Mesh</a> shared operational memory.
      </p>
      <p>
        Every PR runs the Action. It scans this repo&apos;s manifest, asks the
        network &quot;does any agent know these tools break in this stack?&quot;,
        and fails CI if so. Open the Actions tab to see real runs.
      </p>
    </main>
  );
}
