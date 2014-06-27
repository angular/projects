define(["rtts-assert", 'rtts-assert', 'di', '../annotations', './directive_class', './element_selector', './non_element_selector', './selector_config'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7) {
  "use strict";
  var __moduleName = "selector";
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
  var assert = $traceurRuntime.assertObject($__0).assert;
  var assert = $traceurRuntime.assertObject($__1).assert;
  var $__9 = $traceurRuntime.assertObject($__2),
      Inject = $__9.Inject,
      TransientScope = $__9.TransientScope;
  var Directive = $traceurRuntime.assertObject($__3).Directive;
  var $__9 = $traceurRuntime.assertObject($__4),
      ArrayOfDirectiveClass = $__9.ArrayOfDirectiveClass,
      DirectiveClass = $__9.DirectiveClass;
  var $__9 = $traceurRuntime.assertObject($__5),
      ElementSelector = $__9.ElementSelector,
      SelectedElementBindings = $__9.SelectedElementBindings;
  var NonElementSelector = $traceurRuntime.assertObject($__6).NonElementSelector;
  var SelectorConfig = $traceurRuntime.assertObject($__7).SelectorConfig;
  ;
  var Selector = function Selector(config) {
    this.elementSelector = new ElementSelector('');
    this.nonElementSelector = new NonElementSelector(config);
  };
  ($traceurRuntime.createClass)(Selector, {
    addDirectives: function(directives) {
      assert.argumentTypes(directives, ArrayOfDirectiveClass);
      directives.forEach(this.elementSelector.addDirective.bind(this.elementSelector));
    },
    matchElement: function(element) {
      assert.argumentTypes(element, HTMLElement);
      var builder = new SelectedElementBindings(),
          nodeName = element.tagName.toLowerCase(),
          attributeList = element.attributes,
          attrs = {},
          classList = element.classList,
          classes = {},
          i,
          length,
          j,
          jlength,
          partialSelection;
      if (nodeName == 'input' && !attributeList['type']) {
        attributeList['type'] = 'text';
      }
      partialSelection = this.elementSelector.selectNode(builder, partialSelection, nodeName);
      for (i = 0, length = classList.length; i < length; i++) {
        var className = classList[i];
        classes[className] = true;
        partialSelection = this.elementSelector.selectClass(builder, partialSelection, className);
      }
      for (i = 0, length = attributeList.length; i < length; i++) {
        var attr = attributeList[i],
            attrName = attr.name,
            attrValue = attr.value;
        attrs[attrName] = attrValue;
        partialSelection = this.elementSelector.selectAttr(builder, partialSelection, attrName, attrValue);
      }
      while (partialSelection != null) {
        var elementSelectors = partialSelection;
        partialSelection = null;
        for (i = 0, length = elementSelectors.length; i < length; i++) {
          var elementSelector = elementSelectors[i];
          for (var className in classes) {
            partialSelection = elementSelector.selectClass(builder, partialSelection, className);
          }
          for (var attrName in attrs) {
            partialSelection = elementSelector.selectAttr(builder, partialSelection, attrName, attrs[attrName]);
          }
        }
      }
      this.nonElementSelector.selectBindAttr(builder, attrs);
      return assert.returnType((builder), SelectedElementBindings);
    },
    matchText: function(node) {
      assert.argumentTypes(node, Text);
      return assert.returnType((this.nonElementSelector.selectTextNode(node.nodeValue)), $traceurRuntime.type.string);
    }
  }, {});
  Selector.annotations = [new TransientScope, new Inject(SelectorConfig)];
  Selector.prototype.addDirectives.parameters = [[ArrayOfDirectiveClass]];
  Selector.prototype.matchElement.parameters = [[HTMLElement]];
  Selector.prototype.matchText.parameters = [[Text]];
  return {
    get SelectedElementBindings() {
      return SelectedElementBindings;
    },
    get Selector() {
      return Selector;
    },
    __esModule: true
  };
});
