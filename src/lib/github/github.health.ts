import { githubApiCalls, githubRateLimit } from './github.client';

export function getGitHubApiHealth() {
  return {
    calls: githubApiCalls,
    rateLimit: githubRateLimit,
  };
}
