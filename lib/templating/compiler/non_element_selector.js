define(["rtts-assert", 'rtts-assert', './element_selector', './selector_config'], function($__0,$__1,$__2,$__3) {
  "use strict";
  var __moduleName = "non_element_selector";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var assert = $traceurRuntime.assertObject($__1).assert;
  var SelectedElementBindings = $traceurRuntime.assertObject($__2).SelectedElementBindings;
  var SelectorConfig = $traceurRuntime.assertObject($__3).SelectorConfig;
  var ArrayOfMarkedText = function ArrayOfMarkedText() {};
  ($traceurRuntime.createClass)(ArrayOfMarkedText, {}, {assert: function(obj) {
      assert(obj).arrayOf(structure({
        val: assert.string,
        expr: assert.boolean
      }));
    }});
  var NonElementSelector = function NonElementSelector(config) {
    this.config = config;
  };
  ($traceurRuntime.createClass)(NonElementSelector, {
    _convertInterpolationToExpression: function(text) {
      assert.argumentTypes(text, $traceurRuntime.type.string);
      var interpolationParts = text.split(this.config.interpolationRegex),
          part,
          isExpression;
      if (interpolationParts.length <= 1) {
        return null;
      }
      interpolationParts.forEach(function(part, index) {
        if (index % 2 === 0) {
          interpolationParts[index] = "'" + part + "'";
        } else {
          interpolationParts[index] = "(" + part + ")";
        }
      });
      return interpolationParts.join('+');
    },
    _toCamelCase: function(attrName) {
      return attrName.split('-').map((function(part, index) {
        if (index > 0) {
          return part.charAt(0).toUpperCase() + part.substring(1);
        } else {
          return part;
        }
      })).join('');
    },
    selectTextNode: function(text) {
      assert.argumentTypes(text, $traceurRuntime.type.string);
      return this._convertInterpolationToExpression(text);
    },
    selectBindAttr: function(binder, attrs) {
      assert.argumentTypes(binder, SelectedElementBindings, attrs, $traceurRuntime.type.any);
      for (var attrName in attrs) {
        var attrValue = attrs[attrName];
        var interpolationExpr = this._convertInterpolationToExpression(attrValue);
        var match;
        if (interpolationExpr) {
          attrValue = interpolationExpr;
          binder.attrs.bind[this._toCamelCase(attrName)] = attrValue;
        } else if (match = this.config.bindAttrRegex.exec(attrName)) {
          binder.attrs.bind[this._toCamelCase(match[1])] = attrValue;
        } else if (match = this.config.eventAttrRegex.exec(attrName)) {
          binder.attrs.on[this._toCamelCase(match[1])] = attrValue;
        } else {
          binder.attrs.init[this._toCamelCase(attrName)] = attrValue;
        }
      }
      if (attrs['ng-queryable']) {
        binder.attrs.queryable = attrs['ng-queryable'];
      }
    }
  }, {});
  NonElementSelector.prototype._convertInterpolationToExpression.parameters = [[$traceurRuntime.type.string]];
  NonElementSelector.prototype.selectTextNode.parameters = [[$traceurRuntime.type.string]];
  NonElementSelector.prototype.selectBindAttr.parameters = [[SelectedElementBindings], []];
  return {
    get ArrayOfMarkedText() {
      return ArrayOfMarkedText;
    },
    get NonElementSelector() {
      return NonElementSelector;
    },
    __esModule: true
  };
});
