/**
 * Represents a GitHub repository.
 * Only the fields required by the application are defined.
 */
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  updated_at: string;
}

/**
 * Represents a GitHub commit object as returned by the API.
 * Simplified to include only the fields used by the application.
 */
export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
  };
}

/**
 * Represents a GitHub Actions workflow run.
 * Used to determine build status and last run time.
 */
export interface GitHubWorkflowRun {
  id: number;
  status: 'completed' | 'in_progress';
  conclusion: 'success' | 'failure' | 'cancelled' | null;
  updated_at: string;
}
