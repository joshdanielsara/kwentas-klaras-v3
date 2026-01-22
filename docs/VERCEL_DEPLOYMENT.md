# Vercel CLI Deployment Guide

Complete guide for deploying kwentas-klaras-v3 to Vercel using the CLI.

## Table of Contents

1. [Installation](#installation)
2. [Authentication](#authentication)
3. [Project Setup](#project-setup)
4. [Building Locally](#building-locally)
5. [Deployment Methods](#deployment-methods)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

## Installation

### Install Vercel CLI

```bash
npm install -g vercel
```

Or use npx (recommended, always uses latest version):

```bash
npx vercel
```

## Authentication

### First Time Login

1. Run the deployment command:
   ```bash
   npx vercel deploy --prebuilt
   ```

2. If not logged in, you'll be prompted:
   ```
   No existing credentials found. Please log in:
   Visit vercel.com/device and enter [CODE]
   ```

3. Visit `vercel.com/device` and enter the provided code (e.g., `TJGH-MCNQ`)

4. Once authenticated, you'll see:
   ```
   Congratulations! You are now signed in.
   ```

### Verify Authentication

```bash
npx vercel whoami
```

## Project Setup

### Initial Project Linking

When deploying for the first time, Vercel will ask:

1. **Set up and deploy?** → Answer `yes`
2. **Which scope?** → Select your account/team (e.g., `hanz-archer's projects`)
3. **Link to existing project?** → Answer `yes` if project exists, or `no` to create new
4. **Pull environment variables?** → Answer `yes` to download `.env.local`

This creates:
- `.vercel/` directory (project configuration)
- `.vercel/project.json` (project settings)
- `.env.local` (environment variables)

### Pull Project Settings

If project already exists on Vercel:

```bash
npx vercel pull
```

This downloads:
- Project settings
- Environment variables (`.vercel/.env.preview.local`, `.vercel/.env.production.local`)

## Building Locally

### Standard Build

Build the project using Vercel's build command:

```bash
npx vercel build
```

This will:
1. Run `npm install`
2. Execute your build command (`prisma generate && nuxt build`)
3. Generate `.vercel/output/` directory
4. Use Vercel's build environment

### Manual Build

Alternatively, use your npm script:

```bash
npm run build
```

This generates `.output/` directory (Nuxt standard).

**Note:** For `--prebuilt` flag, Vercel expects `.vercel/output/`, so use `npx vercel build` or ensure output matches.

## Deployment Methods

### Method 1: Prebuilt Deployment (Recommended)

**When to use:**
- You've tested the build locally
- Build completes successfully but deployment hangs
- You want faster deployment (skips build step)

**Steps:**

1. Build locally:
   ```bash
   npx vercel build
   ```

2. Deploy prebuilt output:
   ```bash
   # Preview deployment
   npx vercel deploy --prebuilt
   
   # Production deployment
   npx vercel deploy --prebuilt --prod
   ```

**Output:**
```
[success] [nitro] You can deploy this build using `npx vercel deploy --prebuilt`
```

### Method 2: Standard Deployment

**When to use:**
- Normal workflow
- Let Vercel handle the build

**Command:**

```bash
# Preview
npx vercel

# Production
npx vercel --prod
```

### Method 3: Git Integration (Automatic)

**Setup:**

1. Connect repository in Vercel dashboard
2. Configure build settings:
   - **Build Command:** `prisma generate && npm run build`
   - **Output Directory:** `.output`
   - **Install Command:** `npm install`

3. Push to Git:
   ```bash
   git push origin main
   ```

Vercel automatically:
- Detects the push
- Runs the build
- Deploys to Preview (for branches) or Production (for main/master)

## Environment Variables

### Download Environment Variables

```bash
npx vercel env pull .env.local
```

This downloads all environment variables for the current environment.

### Environment-Specific Variables

- **Development:** `.vercel/.env.development.local`
- **Preview:** `.vercel/.env.preview.local`
- **Production:** `.vercel/.env.production.local`

### Set Environment Variables via CLI

```bash
# Add variable
npx vercel env add VARIABLE_NAME

# List variables
npx vercel env ls
```

## Project Configuration

### Nuxt Config for Vercel

Ensure your `nuxt.config.ts` includes:

```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
    // ... other config
  },
})
```

### Vercel Settings

Key settings in Vercel dashboard:

- **Framework Preset:** Nuxt
- **Build Command:** `prisma generate && npm run build`
- **Output Directory:** `.output`
- **Install Command:** `npm install`
- **Root Directory:** (leave empty if project is at root)

## Troubleshooting

### Error: "No prebuilt output found"

**Problem:**
```
Error: The "--prebuilt" option was used, but no prebuilt output found in ".vercel/output"
```

**Solution:**
Run the build first:
```bash
npx vercel build
```

### Error: "Transform failed with external option"

**Problem:**
```
ERROR: Invalid option in transform() call: "external"
```

**Solution:**
Remove invalid `esbuild.external` configuration from `nuxt.config.ts`. Use Nitro's `externals` instead:

```typescript
nitro: {
  externals: {
    inline: ['better-sqlite3'],
  },
}
```

### Deployment Hangs

**Symptoms:**
- Build completes successfully
- Deployment process hangs/stuck

**Solutions:**

1. **Use prebuilt deployment:**
   ```bash
   npx vercel build
   npx vercel deploy --prebuilt --prod
   ```

2. **Check bundle size:**
   - Large bundles (>50MB) may timeout
   - Optimize with code splitting (already configured)

3. **Check Vercel status:**
   - Visit status.vercel.com
   - May be platform issue

4. **Try different time:**
   - Network/load issues can cause hangs

### Build Size Warnings

**Warning:**
```
(!) Some chunks are larger than 500 kB after minification
```

**Solution:**
Already configured in `nuxt.config.ts`:
- Manual chunking for large dependencies
- Increased warning limit to 600KB
- Code splitting enabled

### Swagger-jsdoc Warning

**Warning:**
```
"swagger-jsdoc" is imported by "server/config/swagger.ts", but could not be resolved
```

**Status:** This is expected and safe. `swagger-jsdoc` is in `devDependencies` and only used in development. The warning doesn't affect deployment.

## Best Practices

### 1. Always Test Build Locally

```bash
npm run build
npm run preview
```

### 2. Use Prebuilt for Faster Deployments

After local testing:
```bash
npx vercel build
npx vercel deploy --prebuilt --prod
```

### 3. Environment Variables

- Never commit `.env.local` or `.vercel/` to Git
- Use Vercel dashboard or CLI to manage secrets
- Pull environment variables before local development

### 4. Git Integration

For automatic deployments:
- Connect repository in Vercel dashboard
- Configure build settings once
- Push to trigger deployments automatically

### 5. Monitor Deployments

- Check Vercel dashboard for deployment status
- Review build logs for errors
- Test preview deployments before promoting to production

## Quick Reference

### Common Commands

```bash
# Login
npx vercel login

# Pull project settings
npx vercel pull

# Build locally
npx vercel build

# Deploy preview (prebuilt)
npx vercel deploy --prebuilt

# Deploy production (prebuilt)
npx vercel deploy --prebuilt --prod

# Deploy standard
npx vercel

# Deploy production standard
npx vercel --prod

# List deployments
npx vercel ls

# View logs
npx vercel logs [deployment-url]

# Check status
npx vercel inspect [deployment-url]
```

### File Structure After Setup

```
kwentas-klaras-v3/
├── .vercel/
│   ├── project.json          # Project configuration
│   ├── .env.preview.local    # Preview env vars
│   └── .env.production.local # Production env vars
├── .env.local                # Local development env vars
├── .vercel/output/           # Build output (for --prebuilt)
└── .output/                  # Nuxt build output
```

## Deployment Workflow

### Recommended Workflow

1. **Development:**
   ```bash
   npm run dev
   ```

2. **Test Build:**
   ```bash
   npm run build
   npm run preview
   ```

3. **Deploy Preview:**
   ```bash
   npx vercel build
   npx vercel deploy --prebuilt
   ```

4. **Test Preview:**
   - Visit preview URL
   - Verify functionality

5. **Deploy Production:**
   ```bash
   npx vercel deploy --prebuilt --prod
   ```

   Or promote from dashboard:
   - Go to Vercel dashboard
   - Find preview deployment
   - Click "Promote to Production"

## Configuration Files

### nuxt.config.ts

Key Vercel-specific settings:

```typescript
nitro: {
  preset: 'vercel',           // Required for Vercel
  compressPublicAssets: true, // Optimize assets
  minify: true,               // Minify code
  sourceMap: false,           // Disable source maps in production
}
```

### package.json

Build script:
```json
{
  "scripts": {
    "build": "prisma generate && nuxt build"
  }
}
```

## Troubleshooting Checklist

- [ ] Vercel CLI installed (`npx vercel --version`)
- [ ] Authenticated (`npx vercel whoami`)
- [ ] Project linked (`.vercel/` directory exists)
- [ ] Environment variables set (check Vercel dashboard)
- [ ] Build completes locally (`npm run build`)
- [ ] Output directory correct (`.vercel/output/` for prebuilt)
- [ ] Nuxt config has `preset: 'vercel'`
- [ ] No invalid esbuild options in config
- [ ] Bundle size within limits (<50MB recommended)

## Additional Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Nuxt Deployment Guide](https://nuxt.com/docs/getting-started/deployment)
- [Vercel Build Settings](https://vercel.com/docs/build-step)

## Notes

- Preview deployments are created for every push (if Git integrated)
- Production deployments require `--prod` flag or promotion from dashboard
- Prebuilt deployments skip build step (faster, uses local build)
- Standard deployments run build on Vercel servers (slower, uses Vercel environment)
