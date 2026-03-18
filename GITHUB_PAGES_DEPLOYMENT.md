# GitHub Pages Deployment Guide

This document explains how to configure and deploy this MERN learning platform to GitHub Pages.

## Configuration Setup

The project has been configured to work with GitHub Pages deployment, which requires:

### 1. **Vite Base Path Configuration**

The `vite.config.ts` file now includes support for a base path environment variable:

```typescript
base: process.env.VITE_BASE_PATH || "/",
```

For GitHub Pages deployments at `https://username.github.io/repo-name/`, you need to set:

```bash
VITE_BASE_PATH=/repo-name/
```

### 2. **Wouter Hash Routing**

The `client/src/App.tsx` has been updated to use hash-based routing:

```typescript
<Switch hook={useHashLocation}>
  <Route path={"/"} component={Home} />
  <Route path={"/lessons"} component={LessonList} />
  <Route path={"/lesson/:id"} component={LessonDetail} />
  <Route path={"/lesson/:id/quiz"} component={Quiz} />
  <Route path={"/404"} component={NotFound} />
  <Route component={NotFound} />
</Switch>
```

This enables URLs like:
- `https://username.github.io/repo-name/#/`
- `https://username.github.io/repo-name/#/lessons`
- `https://username.github.io/repo-name/#/lesson/123`

instead of:
- `https://username.github.io/repo-name/` (without hash)
- `https://username.github.io/repo-name/lessons`
- `https://username.github.io/repo-name/lesson/123`

## Deployment Steps

### Option 1: Deploy with GitHub Actions

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: VITE_BASE_PATH=/mern-learning/ pnpm build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

**Note:** Replace `/mern-learning/` with your actual repository name.

### Option 2: Manual Deployment

```bash
# 1. Set the base path for your GitHub Pages URL
# If deploying to: https://vophamthanhan.github.io/mern-learning/
export VITE_BASE_PATH=/mern-learning/

# 2. Build the project
pnpm build

# 3. Deploy dist/public directory to GitHub Pages
# Push the contents of dist/public to gh-pages branch
```

## Environment Variables

### Development

```bash
# .env.local (create this file)
VITE_BASE_PATH=/
```

### Production (GitHub Pages)

```bash
# When building for GitHub Pages
VITE_BASE_PATH=/your-repo-name/
```

## Testing Locally

To test the GitHub Pages deployment locally:

```bash
# Build with the base path
VITE_BASE_PATH=/mern-learning/ pnpm build

# Preview the build
pnpm preview
```

Then access it at `http://localhost:4173/mern-learning/`

## Important Notes

1. **Hash Routing:** All routes now use hash notation (e.g., `/#/lessons`). This is necessary because GitHub Pages doesn't support SPA routing.

2. **Base Path:** Always ensure `VITE_BASE_PATH` matches your GitHub Pages URL structure:
   - User/Organization site: `VITE_BASE_PATH=/`
   - Project site: `VITE_BASE_PATH=/repo-name/`

3. **Links and Navigation:** All links in the application work with both routing modes automatically since Wouter's `Link` component handles hash routing internally.

## Troubleshooting

### Routes not working
- Check that `VITE_BASE_PATH` environment variable is correctly set
- Verify hash routing is enabled in `App.tsx`
- Check browser console for any errors

### Assets not loading
- Verify `base` configuration in `vite.config.ts`
- Ensure `VITE_BASE_PATH` is included in the build command
- Check that dist/public files are uploaded to the correct branch

### 404 errors when navigating
- This is expected with GitHub Pages + SPA. The hash routing handles this.
- If you see actual 404s, check that files are deployed to the correct location

## Repository Structure

```
├── vite.config.ts          # Base path configuration
├── client/
│   ├── index.html          # Entry point
│   └── src/
│       ├── App.tsx         # Hash routing configuration
│       └── pages/          # Route components
├── dist/                   # Build output
│   └── public/            # Deployed to GitHub Pages
└── GITHUB_PAGES_DEPLOYMENT.md  # This file
```

## Additional Resources

- [Wouter Hash Routing](https://github.com/molefrog/wouter#hash-based-routing)
- [Vite Base Configuration](https://vitejs.dev/config/shared-options.html#base)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
