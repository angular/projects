define(["rtts-assert", 'di'], function($__0,$__1) {
  "use strict";
  var __moduleName = "misc";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var Provide = $traceurRuntime.assertObject($__1).Provide;
  function valueProvider(token, value) {
    function provider() {
      return value;
    }
    provider.annotations = [new Provide(token)];
    return provider;
  }
  function getAnnotation(clazz, annotationType) {
    assert.argumentTypes(clazz, Function, annotationType, Function);
    var annotations = clazz.annotations || [];
    var res;
    annotations.forEach(function(annotation) {
      if (annotation instanceof annotationType) {
        res = annotation;
      }
    });
    return res;
  }
  getAnnotation.parameters = [[Function], [Function]];
  return {
    get valueProvider() {
      return valueProvider;
    },
    get getAnnotation() {
      return getAnnotation;
    },
    __esModule: true
  };
});
