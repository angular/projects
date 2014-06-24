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
3. `npm install`
4. `bower install`

## Running the Samples

1. `gulp build watch serve`
2. open [http://localhost:8000/](http://localhost:8000/)

## Development

1. Start the server: `gulp build watch serve`
1. Run protractor e2e tests: `protractor protractor.conf.js`

### Code Style Guide

* Use 2 spaces as tab, see .editorconfig
