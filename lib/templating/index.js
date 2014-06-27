define(['./annotations', './directive/ng_if', './directive/ng_repeat', './view', './view_factory', './watch_group', './util/annotation_provider', './component_loader', './di/injector_queries', './util/module_annotator', './bootstrap'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7,$__8,$__9,$__10) {
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
  if (!$__5 || !$__5.__esModule)
    $__5 = {'default': $__5};
  if (!$__6 || !$__6.__esModule)
    $__6 = {'default': $__6};
  if (!$__7 || !$__7.__esModule)
    $__7 = {'default': $__7};
  if (!$__8 || !$__8.__esModule)
    $__8 = {'default': $__8};
  if (!$__9 || !$__9.__esModule)
    $__9 = {'default': $__9};
  if (!$__10 || !$__10.__esModule)
    $__10 = {'default': $__10};
  var $__annotations__ = $__0;
  var $__directive_47_ng_95_if__ = $__1;
  var $__directive_47_ng_95_repeat__ = $__2;
  var $__view__ = $__3;
  var $__view_95_factory__ = $__4;
  var $__watch_95_group__ = $__5;
  var $__util_47_annotation_95_provider__ = $__6;
  var $__component_95_loader__ = $__7;
  var $__di_47_injector_95_queries__ = $__8;
  var installModuleAnnotator = $traceurRuntime.assertObject($__9).installModuleAnnotator;
  installModuleAnnotator(window.requirejs);
  var bootstrap = $traceurRuntime.assertObject($__10).bootstrap;
  bootstrap();
  return $traceurRuntime.exportStar({
    get View() {
      return $__view__.View;
    },
    get ViewPort() {
      return $__view__.ViewPort;
    },
    get ViewFactory() {
      return $__view_95_factory__.ViewFactory;
    },
    get BoundViewFactory() {
      return $__view_95_factory__.BoundViewFactory;
    },
    get InitAttrs() {
      return $__view_95_factory__.InitAttrs;
    },
    get ChangeEventConfig() {
      return $__watch_95_group__.ChangeEventConfig;
    },
    get AnnotationProvider() {
      return $__util_47_annotation_95_provider__.AnnotationProvider;
    },
    get ComponentLoader() {
      return $__component_95_loader__.ComponentLoader;
    },
    get InjectQuery() {
      return $__di_47_injector_95_queries__.InjectQuery;
    },
    __esModule: true
  }, $__annotations__, $__directive_47_ng_95_if__, $__directive_47_ng_95_repeat__);
});
