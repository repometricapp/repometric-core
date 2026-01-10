export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  updated_at: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
  };
}

export interface GitHubWorkflowRun {
  id: number;
  status: 'completed' | 'in_progress';
  conclusion: 'success' | 'failure' | 'cancelled' | null;
  updated_at: string;
}
