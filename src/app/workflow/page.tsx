export const dynamic = 'force-dynamic';

export default function WorkflowPage() {
  return (
    <main style={{ padding: 24 }}>
      <style>{`
        .workflow {
          font-family: system-ui, sans-serif;
          max-width: 720px;
          margin: 0 auto;
        }

        .box {
          border: 2px solid #333;
          padding: 12px 16px;
          border-radius: 6px;
          background: #fafafa;
          margin: 0 auto;
          text-align: center;
          font-weight: 500;
        }

        .decision {
          border-style: dashed;
          background: #fffdf5;
        }

        .note {
          font-weight: 400;
          font-size: 14px;
          margin-top: 6px;
          color: #333;
        }

        .arrow {
          text-align: center;
          font-size: 20px;
          margin: 8px 0;
          font-family: monospace;
        }

        .center {
          text-align: center;
          font-weight: 600;
          margin: 6px 0;
        }

        .branch {
          margin-left: 32px;
          margin-bottom: 16px;
        }
      `}</style>

      <h1>GitHub Source Resolution Workflow</h1>
      <p>
        This page documents how GitHub sources are resolved based on environment configuration.
      </p>

      <div className="workflow">
        {/* START */}
        <div className="box">START</div>
        <div className="arrow">│</div>

        {/* Explicit repos decision */}
        <div className="box decision">
          Are explicit repos configured?
          <br />
          <code>GITHUB_REPOS</code>
        </div>

        <div className="center">YES → Explicit Repos Mode</div>
        <div className="branch">
          <div className="note">
            • Only specified repositories are tracked
            <br />
            • Format: owner/repo,owner/repo
            <br />• Ignores GITHUB_SOURCES
          </div>
        </div>

        <div className="arrow">│</div>
        <div className="center">NO</div>
        <div className="arrow">│</div>

        {/* Sources decision */}
        <div className="box decision">
          Are sources configured?
          <br />
          <code>GITHUB_SOURCES</code>
        </div>

        <div className="center">YES → Sources Mode</div>
        <div className="branch">
          <div className="note">
            • Discovers all repos from listed orgs/users
            <br />
            • Format: org1,user1,org2,user2
            <br />• Mix orgs and users freely
          </div>
        </div>

        <div className="arrow">│</div>
        <div className="center">NO</div>
        <div className="arrow">│</div>

        {/* Empty */}
        <div className="box">
          No sources configured
          <br />
          <span className="note">(Empty state - add GITHUB_SOURCES)</span>
        </div>
      </div>
    </main>
  );
}
