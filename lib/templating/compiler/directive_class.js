define(["rtts-assert", '../annotations', 'rtts-assert'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "directive_class";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var Directive = $traceurRuntime.assertObject($__1).Directive;
  var assert = $traceurRuntime.assertObject($__2).assert;
  var DirectiveClass = function DirectiveClass(annotation, clazz) {
    assert.argumentTypes(annotation, Directive, clazz, Function);
    this.annotation = annotation;
    this.clazz = clazz;
  };
  ($traceurRuntime.createClass)(DirectiveClass, {}, {});
  DirectiveClass.parameters = [[Directive], [Function]];
  var ArrayOfDirectiveClass = function ArrayOfDirectiveClass() {
    assert.fail('type is not instantiable');
  };
  ($traceurRuntime.createClass)(ArrayOfDirectiveClass, {}, {assert: function(obj) {
      assert(obj).is(assert.arrayOf(DirectiveClass));
    }});
  return {
    get DirectiveClass() {
      return DirectiveClass;
    },
    get ArrayOfDirectiveClass() {
      return ArrayOfDirectiveClass;
    },
    __esModule: true
  };
});
