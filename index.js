define(["rtts-assert", 'templating', 'router'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "index";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var ComponentDirective = $traceurRuntime.assertObject($__1).ComponentDirective;
  var AppRouter = $traceurRuntime.assertObject($__2).AppRouter;
  var App = function App(router) {
    assert.argumentTypes(router, AppRouter);
    this.router = router;
    this.router.configure((function(config) {
      config.title = 'Angular Issues';
      config.map([{
        pattern: ['', 'issues'],
        componentUrl: 'routes/overview',
        title: 'Issues'
      }, {
        pattern: 'issues/:id',
        componentUrl: 'routes/detail'
      }]);
    }));
  };
  ($traceurRuntime.createClass)(App, {}, {});
  App.annotations = [new ComponentDirective];
  App.parameters = [[AppRouter]];
  return {
    get App() {
      return App;
    },
    __esModule: true
  };
});
