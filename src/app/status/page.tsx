import { getGitHubStatus } from '@/lib/github/github.status';

export const dynamic = 'force-dynamic';

export default async function StatusPage() {
  const status = await getGitHubStatus();

  return (
    <main style={{ padding: 24 }}>
      <h1>GitHub Status</h1>

      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>Repository</th>
            <th>Visibility</th>
            <th>Default Branch</th>
            <th>Branches</th>
            <th>Last Commit</th>
            <th>Build Status</th>
            <th>Last Build Time</th>
            <th>Build Error Code</th>
            <th>Build Error</th>
            <th>Open PRs</th>
            <th>Open Issues</th>
          </tr>
        </thead>

        <tbody>
          {status.map((repo) => (
            <tr key={repo.repo}>
              <td>{repo.repo}</td>
              <td>{repo.visibility === 'private' ? 'Private' : 'Public'}</td>
              <td>{repo.defaultBranch}</td>
              <td>{repo.branchCount}</td>
              <td>{repo.lastCommitDate ?? '—'}</td>
              <td>{repo.lastBuildStatus}</td>
              <td>{repo.lastBuildTime ?? '—'}</td>
              <td>{repo.buildErrorCode ?? '—'}</td>
              <td>{repo.buildErrorMessage ?? '—'}</td>
              <td>{repo.openPullRequests}</td>
              <td>{repo.openIssues}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 32 }}>Branches</h2>

      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>Repository</th>
            <th>Branches</th>
          </tr>
        </thead>
        <tbody>
          {status.map((repo) => (
            <tr key={`${repo.repo}-branches`}>
              <td>{repo.repo}</td>
              <td>{repo.branches.length > 0 ? repo.branches.join(', ') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
