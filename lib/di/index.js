define(['./injector', './annotations'], function($__0,$__1) {
  "use strict";
  var __moduleName = "index";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var $__injector__ = $__0;
  var $__annotations__ = $__1;
  return {
    get Injector() {
      return $__injector__.Injector;
    },
    get annotate() {
      return $__annotations__.annotate;
    },
    get Inject() {
      return $__annotations__.Inject;
    },
    get InjectLazy() {
      return $__annotations__.InjectLazy;
    },
    get InjectPromise() {
      return $__annotations__.InjectPromise;
    },
    get InjectParent() {
      return $__annotations__.InjectParent;
    },
    get Provide() {
      return $__annotations__.Provide;
    },
    get ProvidePromise() {
      return $__annotations__.ProvidePromise;
    },
    get SuperConstructor() {
      return $__annotations__.SuperConstructor;
    },
    get TransientScope() {
      return $__annotations__.TransientScope;
    },
    __esModule: true
  };
});
