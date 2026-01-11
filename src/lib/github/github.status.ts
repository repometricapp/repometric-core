import { config } from '@/lib/config';
import { getOrgRepositories, getUserRepositories, getLastCommit } from './github.repos';
import { getLatestWorkflowRun } from './github.actions';
import { getBranches } from './github.branches';
import { getOpenPullRequests } from './github.pulls';
import { getOpenIssues } from './github.issues';
import { GitHubApiError } from './github.client';

/**
 * Aggregates GitHub repository health and status information.
 *
 * Supported sources:
 * - Explicit repositories (highest priority)
 * - Organizations
 * - Users
 *
 * Public repositories only.
 * No authentication assumptions.
 */
export async function getGitHubStatus() {
  const state = config.github.state();

  // Nothing configured → nothing to fetch
  if (state.isEmpty) {
    return [];
  }

  const allRepos: Array<{ repo: any; owner: string }> = [];

  /**
   * 1️⃣ Explicit repos (highest priority)
   */
  if (state.sourceMode === 'explicit-repos') {
    await Promise.all(
      state.repos.map(async (fullName) => {
        const [owner, repoName] = fullName.split('/');
        if (!owner || !repoName) return;

        // We need repo metadata; safest is to fetch via user/org repos
        try {
          const repos =
            state.hasOrganizations && state.organizations.includes(owner)
              ? await getOrgRepositories(owner)
              : await getUserRepositories(owner);

          const repo = repos.find((r) => r.name === repoName);
          if (repo) {
            allRepos.push({ repo, owner });
          }
        } catch {
          // Ignore inaccessible or invalid repos
        }
      })
    );
  }

  /**
   * 2️⃣ Organizations and users (discovery mode)
   */
  if (state.sourceMode === 'orgs-and-users') {
    // Fetch org repositories
    await Promise.all(
      state.organizations.map(async (org) => {
        const repos = await getOrgRepositories(org).catch(() => []);
        repos.forEach((repo) => {
          allRepos.push({ repo, owner: org });
        });
      })
    );

    // Fetch user repositories
    await Promise.all(
      state.users.map(async (user) => {
        const repos = await getUserRepositories(user).catch(() => []);
        repos.forEach((repo) => {
          allRepos.push({ repo, owner: user });
        });
      })
    );
  }

  /**
   * 3️⃣ De-duplicate repositories (owner/name)
   */
  const uniqueRepos = Array.from(
    new Map(allRepos.map(({ repo, owner }) => [`${owner}/${repo.name}`, { repo, owner }])).values()
  );

  /**
   * 4️⃣ Process each repository in parallel
   */
  return Promise.all(
    uniqueRepos.map(async ({ repo, owner }) => {
      let buildErrorCode: number | null = null;
      let buildErrorMessage: string | null = null;

      // Fetch the most recent commit on the default branch
      const commits = await getLastCommit(owner, repo.name, repo.default_branch);
      const lastCommit = commits?.[0];

      // Attempt to fetch the latest GitHub Actions workflow run
      let workflow = null;
      try {
        workflow = await getLatestWorkflowRun(owner, repo.name);
      } catch (err) {
        if (err instanceof GitHubApiError) {
          buildErrorCode = err.status;
          buildErrorMessage = err.message;
        }
      }

      // Fetch repository branches, pull requests, and issues
      const branches = await getBranches(owner, repo.name).catch(() => []);
      const pulls = await getOpenPullRequests(owner, repo.name).catch(() => []);
      const issues = await getOpenIssues(owner, repo.name).catch(() => []);

      return {
        // Repository metadata
        repo: repo.name,
        owner,
        visibility: repo.private ? 'private' : 'public',
        defaultBranch: repo.default_branch,

        // Branch information
        branchCount: branches.length,
        branches: branches.map((b) => b.name),

        // Commit information
        lastCommitDate: lastCommit?.commit.author.date ?? null,

        // Build / workflow information
        lastBuildStatus: workflow?.workflow_runs?.[0]?.conclusion ?? 'no builds',
        lastBuildTime: workflow?.workflow_runs?.[0]?.updated_at ?? null,
        buildErrorCode,
        buildErrorMessage,

        // Issue and pull request signals
        openPullRequests: pulls.length,
        openIssues: issues.length,
      };
    })
  );
}
