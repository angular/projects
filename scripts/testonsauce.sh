#! /bin/sh
SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

function killServer () {
  kill $serverPid
}

gulp build
gulp serve &
serverPid=$!

trap killServer EXIT

SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

protractor protractor.conf.js
