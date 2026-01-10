/**
 * Centralized application configuration.
 *
 * Values are primarily sourced from environment variables
 * with safe defaults for local development and Phase 1 usage.
 */
export const config = {
  github: {
    /**
     * Optional GitHub token.
     *
     * Used to increase API rate limits.
     * Public repositories only in Phase 1.
     */
    token: process.env.GITHUB_TOKEN ?? null,

    /**
     * GitHub username or organization to analyze.
     * Defaults to the Repometric organization for development.
     */
    owner: process.env.GITHUB_OWNER ?? 'repometricapp',

    /**
     * Base URL for the GitHub REST API.
     */
    apiBaseUrl: 'https://api.github.com',
  },
};
