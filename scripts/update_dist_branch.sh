#! /bin/sh
branch=$(git rev-parse --abbrev-ref HEAD)
git checkout dist
rm -rf !(build)
cp -rf build/* .
rm -rf build
git add . -A
# ||true if we had no changes
git commit -m "update site from src" || true
git checkout $branch
