#!/bin/bash
set -e

SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

[ "$TRAVIS_PULL_REQUEST" == "false" ]
[ "$TRAVIS_BRANCH" == "master" ]

echo -e "Publishing dist branch...\n"

git clone https://github.com/angular/projects.git -b dist temp
cd temp

git config --global user.name "marry-poppins"

rm -rf .
cp -rf ../dist/ .
git add . -A
git commit -m "update site from src" || true

git push -fq https://${GH_TOKEN}@github.com/angular/projects.git dist >/dev/null 2>&1

echo -e "Published build to dist branch.\n"
