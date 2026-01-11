/**
 * Centralized application configuration.
 *
 * Phase 1 / 2:
 * - Public repositories only
 * - No authentication concerns
 * - Single & multiple org/user sources
 * - Explicit repo allow-list supported
 * - Everything optional, nothing throws
 */
export const config = {
  github: {
    /**
     * GitHub sources (orgs and/or users)
     * Comma-separated list of GitHub organizations or usernames
     */
    sources: process.env.GITHUB_SOURCES
      ? process.env.GITHUB_SOURCES.split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],

    /**
     * Optional explicit repository allow-list
     * Format: owner/repo
     * Highest precedence
     */
    repos: process.env.GITHUB_REPOS
      ? process.env.GITHUB_REPOS.split(',')
          .map((r) => r.trim())
          .filter(Boolean)
      : [],

    /**
     * GitHub REST API base URL
     */
    apiBaseUrl: 'https://api.github.com',

    /**
     * Derived configuration state (safe for UI & logs)
     */
    state() {
      const sources = Array.from(new Set(this.sources));
      const repos = Array.from(new Set(this.repos));

      /**
       * Precedence rules:
       * 1. Explicit repos
       * 2. Sources (orgs/users)
       * 3. None
       */
      let sourceMode: 'none' | 'explicit-repos' | 'sources';

      if (repos.length > 0) sourceMode = 'explicit-repos';
      else if (sources.length > 0) sourceMode = 'sources';
      else sourceMode = 'none';

      return {
        /**
         * Source resolution
         */
        sourceMode,

        /**
         * Explicit repos
         */
        hasExplicitRepos: repos.length > 0,
        repos,

        /**
         * GitHub sources (orgs/users)
         */
        hasSources: sources.length > 0,
        sources,

        /**
         * Convenience flags
         */
        isEmpty: sourceMode === 'none',
      };
    },
  },
};
