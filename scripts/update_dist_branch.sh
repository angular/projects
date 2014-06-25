#! /bin/sh
set -ex
shopt -s extglob

SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

# keep the .gitignore in the dist branch as well,
# so we don't have to remove node_modules and bower_components folder
# while switching...
cp .gitignore dist
branch=$(git rev-parse --abbrev-ref HEAD)
# TODO: Use "dist" branch to serve via https://projects.angularjs.org/
git checkout gh-pages
git rm -rf .
cp -rf dist/ .
rm -rf dist
git add . -A
# ||true if we had no changes
git commit -m "update site from src" || true
git checkout $branch
