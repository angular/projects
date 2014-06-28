define(['./annotations', './di/injector_queries', './di/node_injector', './di/ce_di_bootstrap', './di/ce_di_bootstrap'], function($__0,$__1,$__2,$__3,$__4) {
  "use strict";
  var __moduleName = "index_ce_di";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  if (!$__4 || !$__4.__esModule)
    $__4 = {'default': $__4};
  var $__annotations__ = $__0;
  var $__di_47_injector_95_queries__ = $__1;
  var $__di_47_node_95_injector__ = $__2;
  var $__di_47_ce_95_di_95_bootstrap__ = $__3;
  var bootstrap = $traceurRuntime.assertObject($__4).bootstrap;
  bootstrap();
  return $traceurRuntime.exportStar({
    get Queryable() {
      return $__annotations__.Queryable;
    },
    get AttachAware() {
      return $__annotations__.AttachAware;
    },
    get QueryScope() {
      return $__annotations__.QueryScope;
    },
    get InjectQuery() {
      return $__di_47_injector_95_queries__.InjectQuery;
    },
    __esModule: true
  }, $__di_47_node_95_injector__, $__di_47_ce_95_di_95_bootstrap__);
});
