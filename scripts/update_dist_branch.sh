#! /bin/sh
set -ex
SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

branch=$(git rev-parse --abbrev-ref HEAD)
# TODO: Use "dist" branch to serve via https://projects.angularjs.org/
git checkout gh-pages
rm -rf !(dist)
cp -rf dist/* .
rm -rf dist
git add . -A
# ||true if we had no changes
git commit -m "update site from src" || true
git checkout $branch
