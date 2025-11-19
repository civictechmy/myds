# GitHub Pages Deployment Guide

This guide explains how to deploy MYDS Storybook and Component Registry to GitHub Pages.

## Deployment Structure

The deployment creates a unified GitHub Pages site with:

```
https://username.github.io/myds/
├── /                           → Registry landing page
├── /registry/                  → Component registry JSON files
│   ├── index.json             → Master component list
│   ├── schema.json            → JSON schema
│   └── styles/default/*.json  → Individual components
└── /storybook/                 → Storybook component browser
```

## Automatic Deployment (Recommended)

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy on every push to `main`

### 2. Trigger Deployment

Push to the `main` branch:

```bash
git add .
git commit -m "Update components"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Build the component registry
2. Build Storybook with correct base path
3. Prepare deployment directory
4. Deploy to GitHub Pages

### 3. Access Your Deployment

After deployment completes (usually 2-5 minutes):
- **Landing Page**: `https://username.github.io/myds/`
- **Storybook**: `https://username.github.io/myds/storybook`
- **Registry**: `https://username.github.io/myds/registry/index.json`

## Manual Deployment

If you prefer to deploy manually:

### 1. Build Everything

```bash
# Build registry
pnpm registry:build

# Build Storybook for GitHub Pages
cd apps/storybook
pnpm build:gh-pages
cd ../..

# Prepare deployment directory
pnpm deploy:prepare
```

### 2. Deploy to gh-pages Branch

```bash
cd deploy

# Initialize git if not already done
git init
git checkout -b gh-pages

# Add all files
git add .
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch (replace 'origin' with your remote name)
git remote add origin https://github.com/username/myds.git
git push -f origin gh-pages
```

### 3. Configure GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select **gh-pages** branch and **/ (root)** folder
4. Click **Save**

## Custom Domain (Optional)

### 1. Configure DNS

Add a CNAME record pointing to `username.github.io`:

```
CNAME    myds    username.github.io
```

### 2. Update Deployment Script

In `scripts/deploy/prepare-gh-pages.ts`, uncomment and update:

```typescript
createCNAME("myds.yourdomain.com");
```

### 3. Update Storybook Base Path

In `apps/storybook/package.json`, update:

```json
{
  "scripts": {
    "build:gh-pages": "BASE_PATH=/storybook storybook build -o dist"
  }
}
```

### 4. Configure in GitHub

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter `myds.yourdomain.com`
3. Enable **Enforce HTTPS**

## Environment-Specific Configuration

### Local Development

```bash
# Start Storybook locally
cd apps/storybook
pnpm dev
# Access at http://localhost:6006
```

### Production Build (Local Testing)

```bash
# Build for production
cd apps/storybook
pnpm build

# Serve locally
npx serve dist
# Access at http://localhost:3000
```

### GitHub Pages Build

```bash
# Build with correct base path
cd apps/storybook
pnpm build:gh-pages
```

## Deployment Scripts Reference

### Registry Scripts

```bash
# Generate component JSON files
pnpm registry:generate

# Build complete registry (generate + index.json)
pnpm registry:build

# Clean registry files
pnpm registry:clean
```

### Deployment Scripts

```bash
# Prepare deployment directory
pnpm deploy:prepare

# Clean deployment directory
pnpm deploy:clean
```

## Troubleshooting

### Storybook 404 errors

**Problem**: Storybook shows 404 errors or broken assets

**Solution**: Ensure `BASE_PATH` is set correctly in build command:
```bash
BASE_PATH=/myds/storybook storybook build -o dist
```

### Registry files not found

**Problem**: Registry JSON files return 404

**Solution**:
1. Check that registry was built: `pnpm registry:build`
2. Verify files exist in `deploy/registry/` directory
3. Check GitHub Pages deployment completed successfully

### GitHub Actions deployment fails

**Problem**: Workflow fails with permissions error

**Solution**:
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Re-run the workflow

### Custom domain not working

**Problem**: Custom domain shows DNS error

**Solution**:
1. Verify DNS CNAME record is configured correctly
2. Wait for DNS propagation (can take up to 24 hours)
3. Ensure CNAME file exists in deploy directory
4. Check GitHub Pages settings show your custom domain

## File Structure

```
myds/
├── .github/
│   └── workflows/
│       └── deploy-gh-pages.yml    # GitHub Actions workflow
├── apps/
│   └── storybook/
│       ├── .storybook/
│       │   └── main.ts            # Storybook config (base path)
│       ├── dist/                  # Build output
│       └── package.json           # build:gh-pages script
├── registry/
│   ├── index.json                 # Generated registry index
│   ├── schema.json                # Generated schema
│   └── styles/default/*.json      # Generated components
├── scripts/
│   ├── registry/
│   │   ├── generate.ts           # Registry generator
│   │   ├── build.ts              # Registry builder
│   │   └── utils.ts              # Utilities
│   └── deploy/
│       └── prepare-gh-pages.ts   # Deployment prep script
└── deploy/                        # Generated deployment directory
    ├── index.html                 # Landing page
    ├── .nojekyll                  # Disable Jekyll
    ├── 404.html                   # 404 page
    ├── CNAME                      # Custom domain (optional)
    ├── registry/                  # Registry files
    └── storybook/                 # Storybook build
```

## URLs Reference

### Default GitHub Pages URLs

Replace `username` with your GitHub username and `myds` with your repo name:

- **Landing**: `https://username.github.io/myds/`
- **Storybook**: `https://username.github.io/myds/storybook/`
- **Registry Index**: `https://username.github.io/myds/registry/index.json`
- **Component**: `https://username.github.io/myds/registry/styles/default/button.json`

### Custom Domain URLs

If using custom domain `myds.yourdomain.com`:

- **Landing**: `https://myds.yourdomain.com/`
- **Storybook**: `https://myds.yourdomain.com/storybook/`
- **Registry Index**: `https://myds.yourdomain.com/registry/index.json`

## Using the Registry

Once deployed, users can install components:

```bash
# Configure components.json
npx shadcn@latest init

# Add MYDS registry URL
{
  "registry": "https://username.github.io/myds/registry"
}

# Install components
npx shadcn@latest add button
```

Or specify registry inline:

```bash
npx shadcn@latest add button --registry=https://username.github.io/myds/registry
```

## Continuous Deployment

The GitHub Actions workflow automatically deploys when:

1. Code is pushed to `main` branch
2. Workflow is manually triggered from Actions tab

### Workflow Steps

1. **Checkout code**
2. **Setup Node.js and pnpm**
3. **Install dependencies**
4. **Build registry** (`pnpm registry:build`)
5. **Build Storybook** (`pnpm build:gh-pages`)
6. **Prepare deployment** (`pnpm deploy:prepare`)
7. **Upload artifact**
8. **Deploy to GitHub Pages**

### Monitoring Deployments

1. Go to **Actions** tab in your repository
2. Click on latest workflow run
3. View deployment status and logs
4. Check deployment URL after completion

## Performance Optimization

### Cache Strategy

The GitHub Actions workflow caches:
- pnpm store
- node_modules
- Build outputs

This reduces deployment time from ~10 minutes to ~2-3 minutes.

### Asset Optimization

Storybook is built with:
- Production mode optimizations
- Minified JavaScript and CSS
- Optimized images
- Tree-shaking

## Security

### GitHub Token Permissions

The workflow uses minimal required permissions:
- `contents: read` - Read repository contents
- `pages: write` - Deploy to GitHub Pages
- `id-token: write` - OIDC authentication

### Dependabot

Enable Dependabot to keep dependencies updated:

1. Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Rollback

To rollback to a previous deployment:

1. Go to **Actions** tab
2. Find the successful deployment you want to restore
3. Click **Re-run all jobs**

Or manually:

```bash
# Checkout previous commit
git checkout <previous-commit-hash>

# Rebuild and deploy
pnpm registry:build
cd apps/storybook && pnpm build:gh-pages && cd ../..
pnpm deploy:prepare

# Force push to gh-pages
cd deploy
git push -f origin gh-pages
```

## Next Steps

After successful deployment:

1. ✅ Test the landing page
2. ✅ Browse Storybook components
3. ✅ Test registry installation with shadcn CLI
4. ✅ Update documentation with your URLs
5. ✅ Share with your team or community

---

**Need Help?**
- Check [REGISTRY.md](./REGISTRY.md) for registry details
- Review [GitHub Pages documentation](https://docs.github.com/en/pages)
- File issues on GitHub repository
