#! /bin/bash
set -ex

SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

git fetch origin master
git checkout origin/master -f
npm install
./node_modules/.bin/bower install
./node_modules/.bin/gulp build
