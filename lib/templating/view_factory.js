define(["rtts-assert", './types', 'di', 'di', './view', './annotations', './component_loader', 'expressionist', './watch_group', './di/node_injector', './util/tree_array', './util/misc'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7,$__8,$__9,$__10,$__11) {
  "use strict";
  var __moduleName = "view_factory";
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
  if (!$__11 || !$__11.__esModule)
    $__11 = {'default': $__11};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var $__14 = $traceurRuntime.assertObject($__1),
      NodeContainer = $__14.NodeContainer,
      CompiledTemplate = $__14.CompiledTemplate;
  var $__14 = $traceurRuntime.assertObject($__2),
      Injector = $__14.Injector,
      TransientScope = $__14.TransientScope;
  var $__14 = $traceurRuntime.assertObject($__3),
      Inject = $__14.Inject,
      Provide = $__14.Provide;
  var $__14 = $traceurRuntime.assertObject($__4),
      View = $__14.View,
      ViewPort = $__14.ViewPort;
  var $__14 = $traceurRuntime.assertObject($__5),
      TemplateDirective = $__14.TemplateDirective,
      ComponentDirective = $__14.ComponentDirective,
      DecoratorDirective = $__14.DecoratorDirective,
      Directive = $__14.Directive,
      Queryable = $__14.Queryable;
  var ComponentLoader = $traceurRuntime.assertObject($__6).ComponentLoader;
  var Parser = $traceurRuntime.assertObject($__7).Parser;
  var $__14 = $traceurRuntime.assertObject($__8),
      WatchGroup = $__14.WatchGroup,
      childWatchGroupProviders = $__14.childWatchGroupProviders,
      isDomApi = $__14.isDomApi;
  var $__14 = $traceurRuntime.assertObject($__9),
      RootInjector = $__14.RootInjector,
      NodeInjector = $__14.NodeInjector;
  var reduceTree = $traceurRuntime.assertObject($__10).reduceTree;
  var $__14 = $traceurRuntime.assertObject($__11),
      valueProvider = $__14.valueProvider,
      getAnnotation = $__14.getAnnotation;
  var EXECUTION_CONTEXT_TOKEN = 'executionContext';
  var ViewFactory = function ViewFactory(componentLoader, rootInjector) {
    this.rootInjector = rootInjector;
    this.componentLoader = componentLoader;
  };
  ($traceurRuntime.createClass)(ViewFactory, {
    createComponentView: function($__14) {
      var element = "element" in $__14 ? $__14.element : null,
          component = $__14.component,
          providers = "providers" in $__14 ? $__14.providers : [],
          viewPort = $__14.viewPort;
      function ViewProvider(nodeInjector) {
        assert.argumentTypes(nodeInjector, NodeInjector);
        return new View([element], nodeInjector, viewPort);
      }
      ViewProvider.annotations = [new Provide(View), new Queryable('view')];
      ViewProvider.parameters = [[NodeInjector]];
      var localProviders = $traceurRuntime.spread(providers, [ViewProvider]);
      var annotation = getAnnotation(component, Directive);
      if (!element) {
        element = document.createElement(annotation.selector);
      }
      var nodeInjector = this._createComponent({
        element: element,
        component: component,
        providers: localProviders,
        parentNodeInjector: viewPort._anchorInjector
      });
      return nodeInjector.get(View);
    },
    _createComponent: function($__15) {
      var element = $__15.element,
          component = $__15.component,
          providers = "providers" in $__15 ? $__15.providers : [],
          parentNodeInjector = $__15.parentNodeInjector;
      var annotation = getAnnotation(component, Directive);
      var localProviders = $traceurRuntime.spread(providers, [component], this._getComponentProviders(component));
      var nodeInjector = parentNodeInjector.createChild({
        node: element,
        providers: localProviders
      });
      this._initComponentDirective({
        nodeInjector: nodeInjector,
        component: component,
        element: element
      });
      return nodeInjector;
    },
    _initComponentDirective: function($__16) {
      var nodeInjector = $__16.nodeInjector,
          component = $__16.component,
          element = $__16.element;
      var componentInstance = nodeInjector.get(component);
      var annotation = getAnnotation(component, Directive);
      var template = this.componentLoader.getTemplateForDirective(component);
      this._bindDirective(nodeInjector, component);
      var childData = this._initTemplate({
        template: template,
        providers: annotation.shadowProviders || [],
        isShadowRoot: true,
        executionContext: componentInstance,
        parentNodeInjector: nodeInjector
      });
      if (!childData.inplace) {
        if (annotation.shadowDOM) {
          createShadowRoot(element).appendChild(childData.container);
        } else {
          element.innerHTML = '';
          element.appendChild(childData.container);
        }
      }
      childData.injector.appendTo(nodeInjector);
    },
    createChildView: function($__17) {
      var template = $__17.template,
          providers = "providers" in $__17 ? $__17.providers : [],
          viewPort = $__17.viewPort,
          executionContext = "executionContext" in $__17 ? $__17.executionContext : null;
      var localProviders = $traceurRuntime.spread(providers, childWatchGroupProviders());
      var childData = this._initTemplate({
        template: template,
        providers: localProviders,
        executionContext: executionContext,
        parentNodeInjector: viewPort._anchorInjector,
        viewPort: viewPort
      });
      return childData.injector.get(View);
    },
    _initTemplate: function($__18) {
      var template = $__18.template,
          providers = $__18.providers,
          parentNodeInjector = $__18.parentNodeInjector,
          isShadowRoot = "isShadowRoot" in $__18 ? $__18.isShadowRoot : false,
          executionContext = "executionContext" in $__18 ? $__18.executionContext : null,
          viewPort = "viewPort" in $__18 ? $__18.viewPort : null;
      function ViewProvider(nodeInjector) {
        assert.argumentTypes(nodeInjector, NodeInjector);
        return new View(container.childNodes, nodeInjector, viewPort);
      }
      ViewProvider.annotations = [new Provide(View), new Queryable('view')];
      ViewProvider.parameters = [[NodeInjector]];
      var localProviders = $traceurRuntime.spread(providers);
      if (executionContext) {
        localProviders.push(valueProvider(EXECUTION_CONTEXT_TOKEN, executionContext));
      }
      var self = this;
      var container;
      var inplace = document.contains(template.container);
      if (inplace) {
        container = template.container;
      } else {
        container = document.importNode(template.container, true);
      }
      if (viewPort) {
        localProviders.push(ViewProvider);
      }
      var viewInjector = parentNodeInjector.createChild({
        node: null,
        providers: localProviders,
        isShadowRoot: isShadowRoot
      });
      var boundElements = container.querySelectorAll('.ng-binder');
      reduceTree(template.binders, initElement, viewInjector);
      return {
        container: container,
        inplace: inplace,
        injector: viewInjector
      };
      function initElement(parentInjector, binder, index) {
        var $__22;
        var element;
        var elementInjector;
        if (index === 0) {
          elementInjector = parentInjector;
          element = container;
        } else {
          element = boundElements[index - 1];
          var localProviders = $traceurRuntime.spread(self._attrProviders(binder.attrs));
          element.classList.remove('ng-binder');
          binder.decorators.forEach((function(decorator) {
            var $__22;
            ($__22 = localProviders).push.apply($__22, $traceurRuntime.spread([decorator], self._getDirectiveProviders(decorator)));
          }));
          if (element.ngInjectorFactory) {
            elementInjector = element.ngInjectorFactory(localProviders);
          } else if (binder.component) {
            elementInjector = self._createComponent({
              element: element,
              component: binder.component,
              providers: localProviders,
              parentNodeInjector: parentInjector
            });
          } else {
            var template = binder.template;
            if (template) {
              ($__22 = localProviders).push.apply($__22, $traceurRuntime.spread([template.directive], self._getTemplateDirectiveProviders(element, template)));
            }
            elementInjector = parentInjector.createChild({
              node: element,
              providers: localProviders
            });
          }
          self._bindAttrs(elementInjector, binder.attrs);
          binder.decorators.forEach((function(decorator) {
            self._bindDirective(elementInjector, decorator);
          }));
          if (binder.template) {
            self._bindDirective(elementInjector, binder.template.directive);
          }
          elementInjector.appendTo(parentInjector);
        }
        binder.textBinders.forEach((function(textBinder) {
          var textNode = element.childNodes[textBinder.indexInParent];
          var nodeInjector = elementInjector.createChild({
            node: textNode,
            providers: providers
          });
          nodeInjector.get(setupNodeBinding(EXECUTION_CONTEXT_TOKEN, {'textContent': textBinder.expression}));
          nodeInjector.appendTo(elementInjector);
        }));
        return elementInjector;
      }
    },
    _bindAttrs: function(nodeInjector, attrs) {
      if (!isEmpty(attrs.bind)) {
        nodeInjector.get(setupNodeBinding(EXECUTION_CONTEXT_TOKEN, attrs.bind));
      }
      if (!isEmpty(attrs.on)) {
        nodeInjector.get(setupEventHandlers(EXECUTION_CONTEXT_TOKEN, attrs.on));
      }
    },
    _bindDirective: function(nodeInjector, directive) {
      nodeInjector.get(directive);
      var annotation = getAnnotation(directive, Directive);
      if (!isEmpty(annotation.observe)) {
        nodeInjector.get(setupDirectiveObserve(directive, annotation.observe));
      }
      if (!isEmpty(annotation.bind)) {
        nodeInjector.get(setupNodeBinding(directive, annotation.bind));
      }
      if (!isEmpty(annotation.on)) {
        nodeInjector.get(setupEventHandlers(directive, annotation.on));
      }
    },
    _attrProviders: function(attrs) {
      function queryableNodeProvider(node) {
        return node;
      }
      queryableNodeProvider.annotations = [new Inject(Node), new Queryable(attrs.queryable)];
      function initAttrsProvider() {
        return attrs.init;
      }
      initAttrsProvider.annotations = [new Provide(InitAttrs)];
      if (attrs.queryable) {
        return [queryableNodeProvider, initAttrsProvider];
      } else {
        return [initAttrsProvider];
      }
    },
    _getDirectiveProviders: function(directive) {
      var annotation = getAnnotation(directive, Directive);
      if (annotation.providers) {
        return annotation.providers;
      } else {
        return [];
      }
    },
    _getComponentProviders: function(component) {
      var providers = $traceurRuntime.spread(childWatchGroupProviders(), this._getDirectiveProviders(component));
      return providers;
    },
    _getTemplateDirectiveProviders: function(node, template) {
      var self = this;
      function boundViewFactoryProvider(viewPort) {
        return new BoundViewFactory({
          viewFactory: self,
          template: template.compiledTemplate,
          viewPort: viewPort
        });
      }
      boundViewFactoryProvider.annotations = [new Provide(BoundViewFactory), new Inject(ViewPort)];
      function viewPortProvider(nodeInjector) {
        return new ViewPort(node, nodeInjector);
      }
      viewPortProvider.annotations = [new Provide(ViewPort), new Inject(NodeInjector), new Queryable('viewPort')];
      return $traceurRuntime.spread([boundViewFactoryProvider, viewPortProvider], this._getDirectiveProviders(template.directive));
    }
  }, {});
  ViewFactory.annotations = [new Inject(ComponentLoader, RootInjector)];
  var BoundViewFactory = function BoundViewFactory($__19) {
    var viewFactory = $__19.viewFactory,
        template = $__19.template,
        viewPort = $__19.viewPort;
    this.viewFactory = viewFactory;
    this.template = template;
    this.viewPort = viewPort;
  };
  ($traceurRuntime.createClass)(BoundViewFactory, {createView: function() {
      var $__20 = $traceurRuntime.assertObject(arguments[0] !== (void 0) ? arguments[0] : {
        executionContext: null,
        providers: []
      }),
          executionContext = "executionContext" in $__20 ? $__20.executionContext : null,
          providers = "providers" in $__20 ? $__20.providers : [];
      return this.viewFactory.createChildView({
        template: this.template,
        providers: providers,
        executionContext: executionContext,
        viewPort: this.viewPort
      });
    }}, {});
  var InitAttrs = 'initAttrs';
  function setupEventHandlers(contextToken, expressions) {
    function setup(node, context, parser) {
      for (var eventName in expressions) {
        node.addEventListener(eventName, createHandler(expressions[eventName]), false);
      }
      function createHandler(expression) {
        var parsedExpr = parser.parse(expression).bind(context);
        return function(event) {
          parsedExpr.eval();
        };
      }
    }
    setup.annotations = [new Inject(Node, contextToken, Parser), new TransientScope];
    return setup;
  }
  function setupNodeBinding(targetToken, expressionMapping) {
    function setup(watchGroup, node, parser, target) {
      if (target === node) {
        throw new Error("Don't use 'bind' for custom elements as 'this' is the element itself!");
      }
      for (var nodeExpr in expressionMapping) {
        setupBinding(parser, watchGroup, [{
          context: node,
          expression: nodeExpr
        }, {
          context: target,
          expression: expressionMapping[nodeExpr]
        }]);
      }
    }
    setup.annotations = [new Inject(WatchGroup, Node, Parser, targetToken), new TransientScope];
    return setup;
  }
  function setupBinding(parser, watchGroup, contextWithExpressions) {
    var assignableExpressions = [];
    var initValue = undefined;
    var initIndex = -1;
    var lastValue;
    contextWithExpressions.forEach((function($__20, index) {
      var context = $__20.context,
          expression = $__20.expression;
      var parsedExpr = parser.parse(expression);
      var boundExpr = parsedExpr.bind(context);
      assignableExpressions[index] = {
        assignable: parsedExpr.isAssignable,
        boundExpr: boundExpr
      };
      if (initIndex === -1) {
        var localValue = boundExpr.eval();
        if (localValue !== undefined && localValue !== null) {
          initIndex = index;
          initValue = localValue;
        }
      }
      watchGroup.watch({
        expression: expression,
        context: context,
        callback: (function() {
          var newValue = boundExpr.eval();
          update(newValue, index);
        })
      });
    }));
    if (initIndex !== -1) {
      update(initValue, initIndex);
    }
    function update(newValue, sourceIndex) {
      if (newValue === lastValue) {
        return;
      }
      lastValue = newValue;
      assignableExpressions.forEach((function($__21, index) {
        var assignable = $__21.assignable,
            boundExpr = $__21.boundExpr;
        if (assignable && index !== sourceIndex) {
          boundExpr.assign(newValue);
        }
      }));
    }
  }
  function setupDirectiveObserve(directive, observedExpressions) {
    function setup(watchGroup, directiveInstance) {
      for (var expression in observedExpressions) {
        initObservedProp(expression, observedExpressions[expression]);
      }
      function initObservedProp(expression, methodName) {
        var match = expression.match(/(.*)\[\]$/);
        var collection = false;
        if (match) {
          expression = match[1];
          collection = true;
        }
        watchGroup.watch({
          expression: expression,
          context: directiveInstance,
          collection: collection,
          callback: (function() {
            var $__22;
            for (var changeData = [],
                $__13 = 0; $__13 < arguments.length; $__13++)
              changeData[$__13] = arguments[$__13];
            return ($__22 = directiveInstance)[methodName].apply($__22, $traceurRuntime.toObject(changeData));
          })
        });
      }
    }
    setup.annotations = [new Inject(WatchGroup, directive), new TransientScope];
    return setup;
  }
  function createShadowRoot(el) {
    var res = ['createShadowRoot', 'webkitCreateShadowRoot'].reduce(function(shadowRoot, fnName) {
      if (!shadowRoot && el[fnName]) {
        shadowRoot = el[fnName]();
      }
      return shadowRoot;
    }, null);
    if (!res) {
      throw new Error('could not find createShadowRoot on the element', el);
    }
    return res;
  }
  function isEmpty(obj) {
    for (var prop in obj) {
      return false;
    }
    return true;
  }
  return {
    get EXECUTION_CONTEXT_TOKEN() {
      return EXECUTION_CONTEXT_TOKEN;
    },
    get ViewFactory() {
      return ViewFactory;
    },
    get BoundViewFactory() {
      return BoundViewFactory;
    },
    get InitAttrs() {
      return InitAttrs;
    },
    __esModule: true
  };
});
