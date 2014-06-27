define(["rtts-assert", 'rtts-assert'], function($__0,$__1) {
  "use strict";
  var __moduleName = "selector_part";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var assert = $traceurRuntime.assertObject($__1).assert;
  var SelectorPart = function SelectorPart() {};
  ($traceurRuntime.createClass)(SelectorPart, {toString: function() {
      return this.element == null ? (this.className == null ? (this.attrValue == '' ? ("[" + this.attrName + "]") : ("[" + this.attrName + "=" + this.attrValue + "]")) : ("." + this.className)) : this.element;
    }}, {});
  SelectorPart.fromElement = function(element) {
    var part = new SelectorPart();
    part.element = element;
    part.className = null;
    part.attrName = null;
    part.attrValue = null;
    return assert.returnType((part), SelectorPart);
  };
  SelectorPart.fromClass = function(className) {
    assert.argumentTypes(className, $traceurRuntime.type.string);
    var part = new SelectorPart();
    part.element = null;
    part.className = className;
    part.attrName = null;
    part.attrValue = null;
    return assert.returnType((part), SelectorPart);
  };
  SelectorPart.fromAttribute = function(attrName, attrValue) {
    assert.argumentTypes(attrName, $traceurRuntime.type.string, attrValue, $traceurRuntime.type.string);
    var part = new SelectorPart();
    part.element = null;
    part.className = null;
    part.attrName = attrName;
    part.attrValue = attrValue;
    return assert.returnType((part), SelectorPart);
  };
  var ArrayOfSelectorPart = function ArrayOfSelectorPart() {
    assert.fail('type is not instantiable');
  };
  ($traceurRuntime.createClass)(ArrayOfSelectorPart, {}, {assert: function(obj) {
      assert(obj).is(assert.arrayOf(SelectorPart));
    }});
  return {
    get SelectorPart() {
      return SelectorPart;
    },
    get ArrayOfSelectorPart() {
      return ArrayOfSelectorPart;
    },
    __esModule: true
  };
});
