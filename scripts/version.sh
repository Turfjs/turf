#!/usr/bin/env bash

set -e
VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Error: Must supply a version"
  echo "Usage ./scripts/version.sh 7.0.0"
  exit 1
fi

# Strip any leading v
VERSION="${VERSION#v}"

if [ -n "$(git status --porcelain)" ]; then
  echo "Working directory must be clean. Please commit or stash changes."
  exit 1
fi

pnpm --recursive exec npm version "$VERSION" --no-git-tag-version
git add .
git commit --no-verify -m "v$VERSION"
git tag -a "v$VERSION" -m "v$VERSION"
