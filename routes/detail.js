define(["rtts-assert", 'router', 'templating', 'services'], function($__0,$__1,$__2,$__3) {
  "use strict";
  var __moduleName = "detail";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var Router = $traceurRuntime.assertObject($__1).Router;
  var ComponentDirective = $traceurRuntime.assertObject($__2).ComponentDirective;
  var GhService = $traceurRuntime.assertObject($__3).GhService;
  var Detail = function Detail(router, service) {
    assert.argumentTypes(router, Router, service, GhService);
    this.router = router;
    this.service = service;
    this.router.configure((function(config) {
      config.map([{
        pattern: ['', 'comments'],
        componentUrl: 'routes/comments',
        nav: true,
        title: 'Comments'
      }, {
        pattern: 'events',
        componentUrl: 'routes/events',
        nav: true
      }]);
    }));
  };
  ($traceurRuntime.createClass)(Detail, {activate: function(params, qs, config) {
      var $__4 = this;
      return this.service.issue(params.id).then((function(issue) {
        config.navModel.title = 'Issue ' + params.id.toString();
        $__4.issue = issue;
      }));
    }}, {});
  Detail.annotations = [new ComponentDirective({selector: 'detail'})];
  Detail.parameters = [[Router], [GhService]];
  return {
    get Detail() {
      return Detail;
    },
    __esModule: true
  };
});
