#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "[deploy-prod] Node $(node -v)"
echo "[deploy-prod] Rebuilding better-sqlite3 for current Node ABI..."
npm rebuild better-sqlite3

echo "[deploy-prod] Building for Vercel..."
npx vercel build

echo "[deploy-prod] Deploying prebuilt output to production..."
npx vercel deploy --prebuilt --prod

echo "[deploy-prod] Production deploy complete."
