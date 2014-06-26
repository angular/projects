define([], function() {
  "use strict";
  var __moduleName = "global";
  function Global() {
    return window;
  }
  return {
    get Global() {
      return Global;
    },
    __esModule: true
  };
});
