define(['./router', './appRouter', './routerViewPort', './pipelineProvider', './navigationCommand'], function($__0,$__1,$__2,$__3,$__4) {
  "use strict";
  var __moduleName = "index";
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
  var $__router__ = $__0;
  var $__appRouter__ = $__1;
  var $__routerViewPort__ = $__2;
  var $__pipelineProvider__ = $__3;
  var $__navigationCommand__ = $__4;
  return {
    get Router() {
      return $__router__.Router;
    },
    get AppRouter() {
      return $__appRouter__.AppRouter;
    },
    get RouterViewPort() {
      return $__routerViewPort__.RouterViewPort;
    },
    get PipelineProvider() {
      return $__pipelineProvider__.PipelineProvider;
    },
    get Redirect() {
      return $__navigationCommand__.Redirect;
    },
    __esModule: true
  };
});
