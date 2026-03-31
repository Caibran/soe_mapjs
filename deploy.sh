#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building for Web..."
npm run dist:web

echo "Preparing deployment directory..."
DEPLOY_DIR="/tmp/soe_mapjs_deploy"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy build artifacts
cp -r dist/web/* "$DEPLOY_DIR/"

# Copy extra folders (GFX and Maps)
echo "Copying gfx and maps..."
cp -r gfx "$DEPLOY_DIR/"
cp -r maps "$DEPLOY_DIR/"

echo "Switching to gh-pages..."
git checkout gh-pages

# Clean current directory
echo "Cleaning gh-pages branch..."
find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +

# Copy back from deploy dir
echo "Copying deployment files..."
cp -r "$DEPLOY_DIR"/* .

echo "Commit and push..."
git add .
git commit -m "Deploy: iPad/Web Phase 2 with 5-digit map fix (re-sync)"
git push origin gh-pages --force

echo "Switching back to master..."
git checkout master
rm -rf "$DEPLOY_DIR"

echo "Done!"
