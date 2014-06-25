define(["rtts-assert", 'templating', 'services'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "overview";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var ComponentDirective = $traceurRuntime.assertObject($__1).ComponentDirective;
  var GhService = $traceurRuntime.assertObject($__2).GhService;
  var Overview = function Overview(service) {
    assert.argumentTypes(service, GhService);
    this.service = service;
  };
  ($traceurRuntime.createClass)(Overview, {activate: function() {
      var $__3 = this;
      return this.service.allIssues().then((function(issues) {
        $__3.issues = issues;
      }));
    }}, {});
  Overview.annotations = [new ComponentDirective({selector: 'overview'})];
  Overview.parameters = [[GhService]];
  return {
    get Overview() {
      return Overview;
    },
    __esModule: true
  };
});
