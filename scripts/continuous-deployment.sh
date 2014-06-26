#! /bin/bash
set -ex

SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

# clone the dist branch into a folder
rm -fr dist
git clone -b dist https://github.com/angular/projects.git dist
