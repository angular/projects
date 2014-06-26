#!/bin/bash
set -e

SCRIPT_DIR=$(dirname $0)

[ "$TRAVIS_PULL_REQUEST" == "false" ]
[ "$TRAVIS_BRANCH" == "master" ]

echo -e "Publishing dist branch...\n"

git config --global user.name "marry-poppins"
$SCRIPT_DIR/update-dist-branch.sh

git push -fq https://${GH_TOKEN}@github.com/angular/projects.git dist > /dev/null

echo -e "Published build to dist branch.\n"
