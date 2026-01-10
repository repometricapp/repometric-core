export const config = {
  github: {
    token: process.env.GITHUB_TOKEN ?? null,
    owner: process.env.GITHUB_OWNER ?? 'repometricapp',
    apiBaseUrl: 'https://api.github.com',
  },
};
