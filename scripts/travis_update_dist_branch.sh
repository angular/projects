#!/bin/bash
set -ex

SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..
echo "Working directory: $(pwd)"
echo "Result of build: $(ls dist)"

[ "$TRAVIS_PULL_REQUEST" == "false" ]
[ "$TRAVIS_BRANCH" == "master" ]

echo -e "Publishing dist branch...\n"

rm -fr temp
git clone https://github.com/angular/projects.git -b dist temp
cd temp

git config user.name "Marry Poppins"
git config user.email "marry-poppins@angularjs.org"

rm -rf *
cp -rf ../dist/* .
git add . -A
git commit -m "update site from src" || true

echo "Pushing..."
# Make sure we don't log the GH_TOKEN in any case!
set +x
git push -fq https://${GH_TOKEN}@github.com/angular/projects.git dist >/dev/null 2>&1

echo -e "Published build to dist branch.\n"