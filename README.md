# repometric-core

The open-source core application.
## Quick Start

1. **Configure your sources** in `.env`:
   ```bash
   # Track repos from organizations and/or users
   GITHUB_SOURCES=myorg,myuser
   
   # Or track specific repos only
   GITHUB_REPOS=owner/repo1,owner/repo2
   ```

2. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```

## Configuration

### Simple Setup

**Option 1: Track all repos from orgs/users** (recommended)
```bash
GITHUB_SOURCES=repometricapp,kdeelz69
```
This will discover and track all public repositories from these orgs and users.

**Option 2: Track specific repos only**
```bash
GITHUB_REPOS=nooblk-98/lighthouse,kdeelz69/wordpress-image
```
This will only track the explicitly listed repositories (ignores GITHUB_SOURCES).

That's it! Mix orgs and users freely in `GITHUB_SOURCES`.