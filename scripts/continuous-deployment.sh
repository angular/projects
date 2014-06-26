#! /bin/bash
set -ex

SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

# update ourselves
git fetch origin master
git checkout origin/master -f

# clone the dist branch into a folder
rm -fr dist
git clone -b dist https://github.com/angular/projects.git
