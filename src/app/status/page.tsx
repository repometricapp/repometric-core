import { getGitHubStatus } from '@/lib/github/github.status';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';

function formatDate(value: string | null) {
  if (!value) return '—';

  return (
    new Date(value).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' UTC'
  );
}

export default async function StatusPage() {
  const githubState = config.github.state();

  const status = githubState.isEmpty ? [] : await getGitHubStatus();

  /**
   * Group repos by owner for display
   */
  const reposByOwner = status.reduce((acc, repo) => {
    if (!acc[repo.owner]) acc[repo.owner] = [];
    acc[repo.owner].push(repo);
    return acc;
  }, {} as Record<string, typeof status>);

  const renderRepoTable = (title: string, repos: typeof status) => (
    <section style={{ marginBottom: 48 }}>
      <h2>{title}</h2>

      {repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <table border={1} cellPadding={8} cellSpacing={0}>
          <thead>
            <tr>
              <th>Repository</th>
              <th>Visibility</th>
              <th>Branch Count</th>
              <th>Default Branch</th>
              <th>Branches</th>
              <th>Last Commit</th>
              <th>Build Status</th>
              <th>Last Build Time</th>
              <th>Build Error</th>
              <th>Open PRs</th>
              <th>Open Issues</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo) => (
              <tr key={`${repo.owner}/${repo.repo}`}>
                <td>{repo.repo}</td>
                <td>{repo.visibility === 'private' ? 'Private' : 'Public'}</td>
                <td>{repo.branchCount}</td>
                <td>{repo.defaultBranch}</td>
                <td>{repo.branches.length > 0 ? repo.branches.join(', ') : '—'}</td>
                <td>{formatDate(repo.lastCommitDate)}</td>
                <td>{repo.lastBuildStatus}</td>
                <td>{formatDate(repo.lastBuildTime)}</td>
                <td>
                  {repo.buildErrorMessage
                    ? `${repo.buildErrorCode}: ${repo.buildErrorMessage}`
                    : '—'}
                </td>
                <td>{repo.openPullRequests}</td>
                <td>{repo.openIssues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );

  return (
    <main style={{ padding: 24 }}>
      <h1>GitHub Status</h1>

      {/* Configuration summary */}
      <section style={{ marginBottom: 32 }}>
        <h2>Configuration (.env)</h2>
        <table border={1} cellPadding={8} cellSpacing={0}>
          <tbody>
            <tr>
              <td>Source Mode</td>
              <td>{githubState.sourceMode}</td>
            </tr>
            <tr>
              <td>Sources</td>
              <td>
                {githubState.sources.length > 0 ? githubState.sources.join(', ') : '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {githubState.isEmpty ? (
        <p>No GitHub sources configured.</p>
      ) : (
        <>
          {Object.entries(reposByOwner).map(([owner, repos]) => (
            <div key={owner}>
              {renderRepoTable(`${owner}`, repos)}
            </div>
          ))}
        </>
      )}
    </main>
  );
}
