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
     * Optional single organization (Phase 1 convenience)
     */
    singleOrganization: process.env.GITHUB_ORG_SINGLE ?? null,

    /**
     * Optional single user (Phase 1 convenience)
     */
    singleUser: process.env.GITHUB_USER_SINGLE ?? null,

    /**
     * Optional multiple organizations (Phase 2)
     * Comma-separated GitHub org names
     */
    organizations: process.env.GITHUB_ORGS
      ? process.env.GITHUB_ORGS.split(',')
          .map((o) => o.trim())
          .filter(Boolean)
      : [],

    /**
     * Optional multiple users (Phase 2)
     * Comma-separated GitHub usernames
     */
    users: process.env.GITHUB_USERS
      ? process.env.GITHUB_USERS.split(',')
          .map((u) => u.trim())
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
      const organizations = Array.from(
        new Set([
          ...(this.singleOrganization ? [this.singleOrganization] : []),
          ...this.organizations,
        ])
      );

      const users = Array.from(
        new Set([...(this.singleUser ? [this.singleUser] : []), ...this.users])
      );

      const repos = Array.from(new Set(this.repos));

      /**
       * Precedence rules:
       * 1. Explicit repos
       * 2. Orgs and/or users
       * 3. None
       */
      let sourceMode: 'none' | 'explicit-repos' | 'orgs-and-users';

      if (repos.length > 0) sourceMode = 'explicit-repos';
      else if (organizations.length > 0 || users.length > 0) sourceMode = 'orgs-and-users';
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
         * Organization info
         */
        hasOrganizations: organizations.length > 0,
        organizations,

        /**
         * User info
         */
        hasUsers: users.length > 0,
        users,

        /**
         * Convenience flags
         */
        isEmpty: sourceMode === 'none',
      };
    },
  },
};
