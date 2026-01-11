import Link from 'next/link';

/**
 * Home page component.
 *
 * Acts as the entry point for the application UI.
 * Provides navigation to other pages.
 */
export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      {/* Application title */}
      <h1>Repometric</h1>

      <p>Repository metrics and health monitoring powered by GitHub.</p>

      {/* Navigation */}
      <nav style={{ marginTop: 32 }}>
        <h2>Pages</h2>
        <ul style={{ fontSize: 16, lineHeight: 1.8 }}>
          <li>
            <Link href="/status">
              <strong>Status</strong> - GitHub repository health dashboard
            </Link>
          </li>
          <li>
            <Link href="/workflow">
              <strong>Workflow</strong> - Source resolution configuration guide
            </Link>
          </li>
        </ul>
      </nav>

      {/* Quick start */}
      <section style={{ marginTop: 32, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <h3>Quick Start</h3>
        <p>
          Configure your GitHub sources in <code>.env</code>:
        </p>
        <pre
          style={{
            backgroundColor: '#222',
            color: '#0f0',
            padding: 12,
            borderRadius: 4,
            overflow: 'auto',
          }}
        >
          {`GITHUB_SOURCES=myorg,myuser`}
        </pre>
        <p>
          Then visit the <Link href="/status">Status</Link> page to see your repositories.
        </p>
      </section>
    </main>
  );
}
