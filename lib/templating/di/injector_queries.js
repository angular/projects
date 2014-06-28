define(['di', '../annotations', './node_injector', '../task_queue'], function($__0,$__1,$__2,$__3) {
  "use strict";
  var __moduleName = "injector_queries";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var $__6 = $traceurRuntime.assertObject($__0),
      Inject = $__6.Inject,
      TransientScope = $__6.TransientScope,
      Injector = $__6.Injector;
  var $__6 = $traceurRuntime.assertObject($__1),
      QueryListener = $__6.QueryListener,
      QueryScope = $__6.QueryScope,
      ImplicitScope = $__6.ImplicitScope,
      AttachAware = $__6.AttachAware;
  var NodeInjector = $traceurRuntime.assertObject($__2).NodeInjector;
  var AsyncTaskQueue = $traceurRuntime.assertObject($__3).AsyncTaskQueue;
  var InjectQuery = function InjectQuery(role) {
    var scope = arguments[1] !== (void 0) ? arguments[1] : QueryScope.LIGHT;
    function arrayProvider(nodeInjector, taskQueue) {
      var list = [];
      var attached = false;
      var valid = false;
      var refreshScheduled = false;
      list.diAttached = diAttached;
      list.diDetached = (function() {
        attached = false;
      });
      list.queryChanged = (function() {
        valid = false;
        refresh();
      });
      return list;
      function diAttached(injector) {
        attached = true;
        refresh();
      }
      diAttached.annotations = [new Inject(Injector)];
      function refresh() {
        if (!attached || valid || refreshScheduled) {
          return;
        }
        refreshScheduled = true;
        taskQueue((function() {
          if (!attached) {
            return;
          }
          refreshScheduled = false;
          valid = true;
          var queryables = nodeInjector._findQueryables({
            role: role,
            scope: scope
          });
          list.length = 0;
          queryables.forEach((function($__6) {
            var $__7;
            var injector = $__6.injector,
                instances = $__6.instances;
            ($__7 = list).push.apply($__7, $traceurRuntime.toObject(instances));
          }));
        }));
      }
    }
    arrayProvider.annotations = [new ImplicitScope, new AttachAware, new QueryListener({
      role: role,
      ordered: true
    }), new Inject(NodeInjector, AsyncTaskQueue)];
    $traceurRuntime.superCall(this, $InjectQuery.prototype, "constructor", [arrayProvider]);
  };
  var $InjectQuery = InjectQuery;
  ($traceurRuntime.createClass)(InjectQuery, {}, {}, Inject);
  function AttachAwareListener() {
    var STORAGE_PROPERTY = '_attachAwareCache';
    return {queryChanged: queryChanged};
    function queryChanged(sourceInjector, addRemove) {
      var changes = sourceInjector._findQueryables({
        scope: QueryScope.DEEP,
        role: 'attachAware'
      });
      changes.forEach((function($__6) {
        var injector = $__6.injector,
            instances = $__6.instances;
        if (addRemove === -1) {
          instances.forEach((function(instance, index) {
            if (instance && instance.diDetached) {
              instance.diDetached();
            }
          }));
          injector[STORAGE_PROPERTY] = [];
        } else if (addRemove === 1) {
          var injectorLastParams = injector[STORAGE_PROPERTY] || [];
          var injectorCurrParams = injector[STORAGE_PROPERTY] = [];
          instances.forEach((function(instance, index) {
            var $__7;
            function proxy() {
              for (var params = [],
                  $__5 = 0; $__5 < arguments.length; $__5++)
                params[$__5] = arguments[$__5];
              return params;
            }
            proxy.annotations = [new TransientScope];
            if (!instance || !instance.diAttached) {
              return;
            }
            if (instance.diAttached.annotations) {
              ($__7 = proxy.annotations).push.apply($__7, $traceurRuntime.toObject(instance.diAttached.annotations));
            }
            proxy.parameters = instance.diAttached.parameters;
            var currParams = injector.get(proxy);
            injectorCurrParams[index] = currParams;
            var localLastParams = injectorLastParams[index];
            if (!localLastParams) {
              ($__7 = instance).diAttached.apply($__7, $traceurRuntime.toObject(currParams));
            } else if (!arrayEqual(currParams, localLastParams)) {
              if (instance.diDetached) {
                instance.diDetached();
              }
              ($__7 = instance).diAttached.apply($__7, $traceurRuntime.toObject(currParams));
            }
          }));
        }
      }));
    }
  }
  AttachAwareListener.annotations = [new QueryListener({
    role: 'attachAware',
    ordered: false
  })];
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
    get AttachAwareListener() {
      return AttachAwareListener;
    },
    __esModule: true
  };
});
