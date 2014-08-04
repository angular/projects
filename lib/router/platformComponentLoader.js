define(["rtts-assert", 'templating'], function($__0,$__1) {
  "use strict";
  var __moduleName = "platformComponentLoader";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var ComponentLoader = $traceurRuntime.assertObject($__1).ComponentLoader;
  var PlatformComponentLoader = function PlatformComponentLoader(loader) {
    assert.argumentTypes(loader, ComponentLoader);
    this.loader = loader;
  };
  ($traceurRuntime.createClass)(PlatformComponentLoader, {loadComponent: function(config) {
      var $__2 = this;
      var url = config.componentUrl;
      if (url.indexOf('.html') == -1) {
        url += '.html';
      }
      return new Promise((function(resolve, reject) {
        $__2.loader.loadFromTemplateUrl({
          templateUrl: url,
          done: (function($__4) {
            var directive = $__4.directive;
            resolve(directive);
          })
        });
      }));
    }}, {});
  PlatformComponentLoader.parameters = [[ComponentLoader]];
  return {
    get PlatformComponentLoader() {
      return PlatformComponentLoader;
    },
    __esModule: true
  };
});
