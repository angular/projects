define(['./ce_di', './injector_queries', './node_injector', '../task_queue'], function($__0,$__1,$__2,$__3) {
  "use strict";
  var __moduleName = "ce_di_bootstrap";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var _mixinCustomElementDi = $traceurRuntime.assertObject($__0).mixinCustomElementDi;
  var AttachAwareListener = $traceurRuntime.assertObject($__1).AttachAwareListener;
  var RootInjector = $traceurRuntime.assertObject($__2).RootInjector;
  var CustomElementAsyncTaskQueue = $traceurRuntime.assertObject($__3).CustomElementAsyncTaskQueue;
  var rootInjector;
  function bootstrap() {
    var providers = [AttachAwareListener, CustomElementAsyncTaskQueue];
    rootInjector = new RootInjector({
      providers: providers,
      node: document
    });
  }
  function mixinCustomElementDi($__4) {
    var proto = $__4.proto,
        type = $__4.type,
        providers = $__4.providers,
        callbacks = $__4.callbacks;
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
