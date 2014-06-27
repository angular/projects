define(['./injector', './annotations', './util', './providers'], function($__0,$__1,$__2,$__3) {
  "use strict";
  var __moduleName = "testing";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var Injector = $traceurRuntime.assertObject($__0).Injector;
  var $__5 = $traceurRuntime.assertObject($__1),
      Inject = $__5.Inject,
      annotate = $__5.annotate,
      readAnnotations = $__5.readAnnotations;
  var isFunction = $traceurRuntime.assertObject($__2).isFunction;
  var createProviderFromFnOrClass = $traceurRuntime.assertObject($__3).createProviderFromFnOrClass;
  var currentSpec = null;
  beforeEach(function() {
    currentSpec = this;
    currentSpec.$$providers = [];
  });
  afterEach(function() {
    currentSpec.$$providers = null;
    currentSpec.$$injector = null;
    currentSpec = null;
  });
  function isRunning() {
    return !!currentSpec;
  }
  function use(mock) {
    if (currentSpec && currentSpec.$$injector) {
      throw new Error('Cannot call use() after inject() has already been called.');
    }
    var providerWrapper = {provider: mock};
    var fn = function() {
      currentSpec.$$providers.push(providerWrapper);
    };
    fn.as = function(token) {
      if (currentSpec && currentSpec.$$injector) {
        throw new Error('Cannot call as() after inject() has already been called.');
      }
      providerWrapper.as = token;
      if (isRunning()) {
        return undefined;
      }
      return fn;
    };
    if (isRunning()) {
      fn();
    }
    return fn;
  }
  function inject() {
    for (var params = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      params[$__4] = arguments[$__4];
    var behavior = params.pop();
    annotate(behavior, new (Function.prototype.bind.apply(Inject, $traceurRuntime.spread([null], params)))());
    var run = function() {
      if (!currentSpec.$$injector) {
        var providers = new Map();
        var modules = [];
        var annotations;
        currentSpec.$$providers.forEach(function(providerWrapper) {
          if (!providerWrapper.as) {
            modules.push(providerWrapper.provider);
          } else {
            if (!isFunction(providerWrapper.provider)) {
              providers.set(providerWrapper.as, createProviderFromFnOrClass(function() {
                return providerWrapper.provider;
              }, {
                provide: {
                  token: null,
                  isPromise: false
                },
                params: []
              }));
            } else {
              annotations = readAnnotations(providerWrapper.provider);
              providers.set(providerWrapper.as, createProviderFromFnOrClass(providerWrapper.provider, annotations));
            }
          }
        });
        currentSpec.$$injector = new Injector(modules, null, providers);
      }
      currentSpec.$$injector.get(behavior);
    };
    return isRunning() ? run() : run;
  }
  ;
  return {
    get use() {
      return use;
    },
    get inject() {
      return inject;
    },
    __esModule: true
  };
});
