define([], function() {
  "use strict";
  var __moduleName = "config";
  function Config() {
    return {github: {
        user: 'angular',
        repository: 'angular.js'
      }};
  }
  return {
    get Config() {
      return Config;
    },
    __esModule: true
  };
});
