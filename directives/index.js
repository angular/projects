define(['router', 'templating', './ng_active'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "index";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var $__router__ = $__0;
  var $__templating__ = $__1;
  var $__ng_95_active__ = $__2;
  return $traceurRuntime.exportStar({
    get RouterViewPort() {
      return $__router__.RouterViewPort;
    },
    get NgRepeat() {
      return $__templating__.NgRepeat;
    },
    get NgIf() {
      return $__templating__.NgIf;
    },
    __esModule: true
  }, $__ng_95_active__);
});
