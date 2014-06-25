define([], function() {
  "use strict";
  var __moduleName = "modelBinding";
  var ApplyModelBindersStep = function ApplyModelBindersStep() {};
  ($traceurRuntime.createClass)(ApplyModelBindersStep, {run: function(navigationContext, next) {
      return next();
    }}, {});
  return {
    get ApplyModelBindersStep() {
      return ApplyModelBindersStep;
    },
    __esModule: true
  };
});
