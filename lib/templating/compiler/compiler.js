define(["rtts-assert", '../types', './directive_class', './selector', '../annotations', 'di', '../util/misc', '../util/tree_array'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7) {
  "use strict";
  var __moduleName = "compiler";
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
  var $__9 = $traceurRuntime.assertObject($__1),
      ArrayOfClass = $__9.ArrayOfClass,
      ArrayLikeOfNodes = $__9.ArrayLikeOfNodes,
      ArrayOfString = $__9.ArrayOfString,
      TextBinder = $__9.TextBinder,
      ElementBinder = $__9.ElementBinder,
      NodeContainer = $__9.NodeContainer,
      CompiledTemplate = $__9.CompiledTemplate;
  var $__9 = $traceurRuntime.assertObject($__2),
      DirectiveClass = $__9.DirectiveClass,
      ArrayOfDirectiveClass = $__9.ArrayOfDirectiveClass;
  var $__9 = $traceurRuntime.assertObject($__3),
      Selector = $__9.Selector,
      SelectedElementBindings = $__9.SelectedElementBindings;
  var $__9 = $traceurRuntime.assertObject($__4),
      Directive = $__9.Directive,
      TemplateDirective = $__9.TemplateDirective;
  var $__9 = $traceurRuntime.assertObject($__5),
      Inject = $__9.Inject,
      InjectLazy = $__9.InjectLazy;
  var getAnnotation = $traceurRuntime.assertObject($__6).getAnnotation;
  var reduceTree = $traceurRuntime.assertObject($__7).reduceTree;
  var Compiler = function Compiler(selectorFactory) {
    this.selectorFactory = selectorFactory;
  };
  ($traceurRuntime.createClass)(Compiler, {
    compileChildNodes: function(container, directives) {
      assert.argumentTypes(container, NodeContainer, directives, ArrayOfClass);
      var directiveClasses = [];
      var self = this;
      directives.forEach(function(directive) {
        var annotation = getAnnotation(directive, Directive);
        if (annotation) {
          directiveClasses.push(new DirectiveClass(annotation, directive));
        }
      });
      return assert.returnType((this._compileChildNodes(container, directiveClasses)), CompiledTemplate);
    },
    _compileChildNodes: function(container, directiveClasses) {
      assert.argumentTypes(container, NodeContainer, directiveClasses, $traceurRuntime.type.any);
      var selector = this.selectorFactory();
      selector.addDirectives(directiveClasses);
      return assert.returnType((new CompileRun(selector).compile(container).build(container)), CompiledTemplate);
    }
  }, {});
  Compiler.parameters = [[new InjectLazy(Selector)]];
  Compiler.prototype.compileChildNodes.parameters = [[NodeContainer], [ArrayOfClass]];
  Compiler.prototype._compileChildNodes.parameters = [[NodeContainer], []];
  var CompileElement = function CompileElement($__9) {
    var level = $__9.level,
        element = $__9.element,
        attrs = $__9.attrs,
        decorators = $__9.decorators,
        component = $__9.component,
        template = $__9.template,
        customElement = $__9.customElement;
    this.element = element;
    this.level = level;
    this.attrs = attrs || {
      init: {},
      bind: {},
      on: {}
    };
    this.decorators = decorators || [];
    this.component = component || null;
    this.template = template || null;
    this.textBinders = [];
    this.customElement = customElement;
  };
  ($traceurRuntime.createClass)(CompileElement, {
    hasBindings: function() {
      for (var prop in this.attrs.bind) {
        return true;
      }
      for (var prop in this.attrs.on) {
        return true;
      }
      if (this.attrs.queryable) {
        return true;
      }
      if (this.component || this.decorators.length || this.template || this.textBinders.length) {
        return true;
      }
      if (this.customElement) {
        return true;
      }
      return false;
    },
    addTextBinder: function(expression, indexInParent) {
      assert.argumentTypes(expression, $traceurRuntime.type.string, indexInParent, $traceurRuntime.type.number);
      this.textBinders.push({
        indexInParent: indexInParent,
        expression: expression
      });
    },
    toBinder: function(level) {
      return {
        level: level,
        attrs: this.attrs,
        decorators: this.decorators,
        component: this.component,
        template: this.template,
        textBinders: this.textBinders,
        customElement: this.customElement
      };
    }
  }, {});
  CompileElement.prototype.addTextBinder.parameters = [[$traceurRuntime.type.string], [$traceurRuntime.type.number]];
  var ArrayOfCompileElements = function ArrayOfCompileElements() {
    throw new Error('not instantiable as just a type');
  };
  ($traceurRuntime.createClass)(ArrayOfCompileElements, {}, {assert: function(obj) {
      assert(obj).is(assert.arrayOf(CompileElement));
    }});
  var CompileRun = function CompileRun(selector) {
    var initialCompileElement = arguments[1] !== (void 0) ? arguments[1] : null;
    assert.argumentTypes(selector, Selector, initialCompileElement, CompileElement);
    this.selector = selector;
    this.initialCompileElement = initialCompileElement;
  };
  var $CompileRun = CompileRun;
  ($traceurRuntime.createClass)(CompileRun, {
    compile: function(container) {
      assert.argumentTypes(container, NodeContainer);
      this.compileElements = [new CompileElement({
        element: null,
        level: 0
      })];
      if (this.initialCompileElement) {
        this.compileElements.push(this.initialCompileElement);
        this.initialCompileElement.level = 1;
      }
      this.compileRecurse(container, this.compileElements[this.compileElements.length - 1]);
      return assert.returnType((this), $CompileRun);
    },
    build: function(container) {
      assert.argumentTypes(container, NodeContainer);
      var binders = [];
      reduceTree(this.compileElements, collectNonEmptyBindersAndCalcBinderTreeLevel, -1);
      return {
        container: container,
        binders: binders
      };
      function collectNonEmptyBindersAndCalcBinderTreeLevel(parentLevel, compileElement, index) {
        var newLevel;
        if (index === 0 || compileElement.hasBindings()) {
          newLevel = parentLevel + 1;
          if (index > 0) {
            compileElement.element.classList.add('ng-binder');
          }
          binders.push(compileElement.toBinder(newLevel));
        } else {
          newLevel = parentLevel;
        }
        return newLevel;
      }
    },
    compileRecurse: function(container, parentElement) {
      assert.argumentTypes(container, NodeContainer, parentElement, CompileElement);
      var nodes = container.childNodes,
          nodeCount = nodes.length,
          nodeIndex,
          nodeType,
          node;
      for (nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
        node = nodes[nodeIndex];
        nodeType = node.nodeType;
        if (nodeType == Node.ELEMENT_NODE) {
          var matchedBindings = this.selector.matchElement(node);
          var component;
          if (matchedBindings.component) {
            component = classFromDirectiveClass(matchedBindings.component);
          } else {
            component = null;
          }
          var compileElement = new CompileElement({
            level: parentElement.level + 1,
            element: node,
            attrs: matchedBindings.attrs,
            decorators: matchedBindings.decorators.map(classFromDirectiveClass),
            component: component,
            customElement: matchedBindings.customElement
          });
          if (matchedBindings.template) {
            this.compileElements.push(this._compileTemplateDirective(node, matchedBindings.template, compileElement));
          } else {
            this.compileElements.push(compileElement);
            this.compileRecurse(node, compileElement);
          }
        } else if (nodeType == Node.TEXT_NODE) {
          var textExpression = this.selector.matchText(node);
          if (textExpression) {
            parentElement.addTextBinder(textExpression, nodeIndex);
          }
        }
      }
    },
    _compileTemplateDirective: function(node, templateDirective, compileElement) {
      assert.argumentTypes(node, HTMLElement, templateDirective, DirectiveClass, compileElement, CompileElement);
      var emptyTemplate = document.createElement('template');
      node.parentNode.insertBefore(emptyTemplate, node);
      node.remove();
      var elementLevel = compileElement.level;
      var initialCompiledTemplateElement = null;
      var compileNodeContainer;
      var templateNodeAttrs = compileElement.attrs;
      var templateContainer = node;
      if (node.nodeName !== 'TEMPLATE') {
        compileNodeContainer = node;
        templateContainer = document.createDocumentFragment();
        templateContainer.appendChild(node);
        if (compileElement.hasBindings()) {
          initialCompiledTemplateElement = compileElement;
        }
        var bindAttrs = templateDirective.annotation.bind || {};
        var bindAttrNames = [];
        for (var bindAttrName in bindAttrs) {
          bindAttrNames.push(bindAttrName);
        }
        templateNodeAttrs = this._splitNodeAttrs(compileElement.attrs, bindAttrNames);
      } else {
        compileNodeContainer = node.content;
        templateContainer = node.content;
      }
      var compiledTemplate = new $CompileRun(this.selector, initialCompiledTemplateElement).compile(compileNodeContainer).build(templateContainer);
      return assert.returnType((new CompileElement({
        element: emptyTemplate,
        level: elementLevel,
        attrs: templateNodeAttrs,
        template: {
          directive: classFromDirectiveClass(templateDirective),
          compiledTemplate: compiledTemplate
        }
      })), CompileElement);
    },
    _splitNodeAttrs: function(attrs, props) {
      assert.argumentTypes(attrs, $traceurRuntime.type.any, props, ArrayOfString);
      var res = {
        init: attrs.init,
        bind: {}
      };
      props.forEach((function(propName) {
        if (propName in attrs.bind) {
          res.bind[propName] = attrs.bind[propName];
          delete attrs.bind[propName];
        }
      }));
      return res;
    },
    _replaceNodeWithComment: function(node, commentText) {
      var parent = node.parentNode;
      var comment = document.createComment(commentText);
      var comment = node.ownerDocument.createComment(commentText);
      parent.insertBefore(comment, node);
      parent.removeChild(node);
      return comment;
    }
  }, {});
  CompileRun.parameters = [[Selector], [CompileElement]];
  CompileRun.prototype.compile.parameters = [[NodeContainer]];
  CompileRun.prototype.build.parameters = [[NodeContainer]];
  CompileRun.prototype.compileRecurse.parameters = [[NodeContainer], [CompileElement]];
  CompileRun.prototype._compileTemplateDirective.parameters = [[HTMLElement], [DirectiveClass], [CompileElement]];
  CompileRun.prototype._splitNodeAttrs.parameters = [[], [ArrayOfString]];
  function classFromDirectiveClass(directiveClass) {
    return directiveClass.clazz;
  }
  return {
    get Compiler() {
      return Compiler;
    },
    __esModule: true
  };
});
