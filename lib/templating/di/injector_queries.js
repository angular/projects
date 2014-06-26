define(['di', '../annotations', './node_injector'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "injector_queries";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var $__5 = $traceurRuntime.assertObject($__0),
      Inject = $__5.Inject,
      TransientScope = $__5.TransientScope,
      Injector = $__5.Injector;
  var $__5 = $traceurRuntime.assertObject($__1),
      QueryListener = $__5.QueryListener,
      QueryScope = $__5.QueryScope,
      ImplicitScope = $__5.ImplicitScope,
      SystemAttachAware = $__5.SystemAttachAware;
  var NodeInjector = $traceurRuntime.assertObject($__2).NodeInjector;
  var InjectQuery = function InjectQuery(role) {
    var scope = arguments[1] !== (void 0) ? arguments[1] : QueryScope.LIGHT;
    function arrayProvider(nodeInjector) {
      var list = [];
      var attached = false;
      var valid = false;
      var result = {
        changeCounter: 0,
        diAttached: diAttached,
        diDetached: (function() {
          attached = false;
        }),
        queryChanged: (function() {
          valid = false;
          result.changeCounter++;
        })
      };
      Object.defineProperty(result, 'entries', {get: getList});
      return result;
      function diAttached(injector) {
        attached = true;
      }
      diAttached.annotations = [new Inject(Injector)];
      function getList() {
        if (!attached || valid) {
          return list;
        }
        var queryables = nodeInjector._findQueryables({
          role: role,
          scope: scope
        });
        list.length = 0;
        queryables.forEach((function($__5) {
          var $__6;
          var injector = $__5.injector,
              instances = $__5.instances;
          ($__6 = list).push.apply($__6, $traceurRuntime.toObject(instances));
        }));
        valid = true;
        return list;
      }
    }
    arrayProvider.annotations = [new ImplicitScope, new SystemAttachAware, new QueryListener({
      role: role,
      ordered: true,
      priority: 0
    }), new Inject(NodeInjector)];
    $traceurRuntime.superCall(this, $InjectQuery.prototype, "constructor", [arrayProvider]);
  };
  var $InjectQuery = InjectQuery;
  ($traceurRuntime.createClass)(InjectQuery, {}, {}, Inject);
  function SystemAttachAwareListener() {
    return createAttachAwareListener('systemAttachAware', null);
  }
  SystemAttachAwareListener.annotations = [new QueryListener({
    role: 'systemAttachAware',
    priority: 1000,
    ordered: false
  })];
  function AttachAwareListener() {
    return createAttachAwareListener('attachAware');
  }
  AttachAwareListener.annotations = [new QueryListener({
    role: 'attachAware',
    priority: -1000,
    ordered: false
  })];
  function createAttachAwareListener(role) {
    return {queryChanged: queryChanged};
    function queryChanged(sourceInjector, addRemove) {
      var storageProperty = '_' + role + 'Cache';
      var changes = sourceInjector._findQueryables({
        scope: QueryScope.DEEP,
        role: role
      });
      var allLastParams = sourceInjector[storageProperty] || {};
      var allCurrParams = {};
      changes.forEach((function($__5) {
        var injector = $__5.injector,
            instances = $__5.instances;
        if (addRemove === -1) {
          var injectorLastParams = allLastParams[injector._id] || [];
          instances.forEach((function(instance, index) {
            var localLastParams = injectorLastParams[index];
            if (localLastParams) {
              if (instance && instance.diDetached) {
                instance.diDetached();
              }
            }
          }));
        } else if (addRemove === 1) {
          var injectorLastParams = allLastParams[injector._id] || [];
          var injectorCurrParams = [];
          allCurrParams[injector._id] = injectorCurrParams;
          instances.forEach((function(instance, index) {
            var $__6;
            function proxy() {
              for (var params = [],
                  $__4 = 0; $__4 < arguments.length; $__4++)
                params[$__4] = arguments[$__4];
              return params;
            }
            proxy.annotations = [new TransientScope];
            if (!instance || !instance.diAttached) {
              return;
            }
            if (instance.diAttached.annotations) {
              ($__6 = proxy.annotations).push.apply($__6, $traceurRuntime.toObject(instance.diAttached.annotations));
            }
            proxy.parameters = instance.diAttached.parameters;
            var currParams = injector.get(proxy);
            injectorCurrParams[index] = currParams;
            var localLastParams = injectorLastParams[index];
            if (!localLastParams) {
              ($__6 = instance).diAttached.apply($__6, $traceurRuntime.toObject(currParams));
            } else if (!arrayEqual(currParams, localLastParams)) {
              if (instance.diDetached) {
                instance.diDetached();
              }
              ($__6 = instance).diAttached.apply($__6, $traceurRuntime.toObject(currParams));
            }
          }));
        }
      }));
      sourceInjector[storageProperty] = allCurrParams;
    }
  }
  function arrayEqual(arr1, arr2) {
    if (arr1 === arr2) {
      return true;
    }
    if (!arr1 || !arr2) {
      return false;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }
  return {
    get InjectQuery() {
      return InjectQuery;
    },
    get SystemAttachAwareListener() {
      return SystemAttachAwareListener;
    },
    get AttachAwareListener() {
      return AttachAwareListener;
    },
    __esModule: true
  };
});
