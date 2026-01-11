/**
 * Centralized application configuration.
 *
 * Phase 1:
 * - Public repositories only
 * - Single org and/or single user
 * - No authentication
 * - No assumptions, no throwing
 */
export const config = {
  github: {
    /**
     * Optional single organization
     */
    singleOrganization: process.env.GITHUB_ORG_SINGLE ?? null,

    /**
     * Optional single user
     */
    singleUser: process.env.GITHUB_USER_SINGLE ?? null,

    /**
     * GitHub REST API base URL
     */
    apiBaseUrl: 'https://api.github.com',

    /**
     * Derived configuration state (safe for UI)
     */
    state() {
      const hasOrg = Boolean(this.singleOrganization);
      const hasUser = Boolean(this.singleUser);

      let mode: 'N/A' | 'org-only' | 'user-only' | 'org-and-user';

      if (hasOrg && hasUser) mode = 'org-and-user';
      else if (hasOrg) mode = 'org-only';
      else if (hasUser) mode = 'user-only';
      else mode = 'N/A';

      return {
        mode,
        hasOrganization: hasOrg,
        hasUser,
        organization: this.singleOrganization,
        user: this.singleUser,
      };
    },
  },
};
