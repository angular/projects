define(["rtts-assert", 'templating', 'services'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "events";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var ComponentDirective = $traceurRuntime.assertObject($__1).ComponentDirective;
  var GhService = $traceurRuntime.assertObject($__2).GhService;
  var Events = function Events(service) {
    assert.argumentTypes(service, GhService);
    this.service = service;
  };
  ($traceurRuntime.createClass)(Events, {activate: function(params) {
      var $__3 = this;
      return this.service.events(params.$parent.id).then((function(events) {
        $__3.events = events;
      }));
    }}, {});
  Events.annotations = [new ComponentDirective({selector: 'events'})];
  Events.parameters = [[GhService]];
  return {
    get Events() {
      return Events;
    },
    __esModule: true
  };
});
