# Projects [![Build Status](https://travis-ci.org/angular/projects.svg?branch=master)](https://travis-ci.org/angular/projects)

A Github client built with Angular 2

[https://projects.angularjs.org](https://projects.angularjs.org)

## Continuous Deployment

```
$ su www-data
$ node continuous-deployment.js
```
Starts a server at port 3000 to
respond to changes from `master`.

## Setup

1. Install [NodeJS](http://nodejs.org/)
2. `npm install -g gulp`
3. `npm install -g bower`
3. `npm install -g protractor`
3. `npm install`
4. `bower install`

## Running the Samples

1. `gulp build watch serve`
2. open [http://localhost:8000/](http://localhost:8000/)

## Running e2e tests locally

1. Start the server: `gulp build watch serve`
1. Start the selenium server: `webdriver-manager start`
1. `protractor protractor.conf.js`

## Multi project development

* call `scripts/dev-dep.sh` to replace a dependency in `node_modules` with a symlink.
   E.g. `scripts/dev-dep.sh templating` will replace `node_modules/templating` with a symlink
   to `../templating`. If that folder already exists it will just use it. Otherwise it will
   clone `templating` from Github and store it there.
* call `scripts/npm-dep.sh` to revert this change.

### Code Style Guide

* Use 2 spaces as tab, see .editorconfig
