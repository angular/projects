define([], function() {
  "use strict";
  var __moduleName = "navigationCommand";
  function isNavigationCommand(obj) {
    return obj && typeof obj.navigate === 'function';
  }
  var Redirect = function Redirect(url) {
    this.url = url;
    this.shouldContinueProcessing = false;
  };
  ($traceurRuntime.createClass)(Redirect, {navigate: function(appRouter) {
      (this.router || appRouter).navigate(this.url, {
        trigger: true,
        replace: true
      });
    }}, {});
  return {
    get isNavigationCommand() {
      return isNavigationCommand;
    },
    get Redirect() {
      return Redirect;
    },
    __esModule: true
  };
});
