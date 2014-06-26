define(["rtts-assert"], function($__0) {
  "use strict";
  var __moduleName = "annotation_provider";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var assert = $traceurRuntime.assertObject($__0).assert;
  function AnnotationProvider() {
    return function(clazz, annotationType) {
      assert.argumentTypes(clazz, Function, annotationType, Function);
      var annotations = clazz.annotations || [];
      var res;
      annotations.forEach(function(annotation) {
        if (annotation instanceof annotationType) {
          res = annotation;
        }
      });
      return res;
    };
  }
  return {
    get AnnotationProvider() {
      return AnnotationProvider;
    },
    __esModule: true
  };
});
