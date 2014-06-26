define(['./gh_service', './http'], function($__0,$__1) {
  "use strict";
  var __moduleName = "index";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var $__gh_95_service__ = $__0;
  var $__http__ = $__1;
  return {
    get GhService() {
      return $__gh_95_service__.GhService;
    },
    get Http() {
      return $__http__.Http;
    },
    __esModule: true
  };
});
