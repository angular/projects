define(['./ce_di', './injector_queries', './node_injector'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "ce_di_bootstrap";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var _mixinCustomElementDi = $traceurRuntime.assertObject($__0).mixinCustomElementDi;
  var $__3 = $traceurRuntime.assertObject($__1),
      SystemAttachAwareListener = $__3.SystemAttachAwareListener,
      AttachAwareListener = $__3.AttachAwareListener;
  var RootInjector = $traceurRuntime.assertObject($__2).RootInjector;
  var rootInjector;
  function bootstrap() {
    var providers = [SystemAttachAwareListener, AttachAwareListener];
    rootInjector = new RootInjector({
      providers: providers,
      node: document
    });
  }
  function mixinCustomElementDi($__3) {
    var proto = $__3.proto,
        type = $__3.type,
        providers = $__3.providers,
        callbacks = $__3.callbacks;
    return _mixinCustomElementDi({
      proto: proto,
      type: type,
      providers: providers,
      callbacks: callbacks,
      rootInjector: rootInjector
    });
  }
  return {
    get bootstrap() {
      return bootstrap;
    },
    get mixinCustomElementDi() {
      return mixinCustomElementDi;
    },
    __esModule: true
  };
});
