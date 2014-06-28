define(['./types', 'di', 'di', './view', './annotations', './component_loader', 'expressionist', './watch_group', './di/node_injector', './util/tree_array', './util/misc'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7,$__8,$__9,$__10) {
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
  var $__13 = $traceurRuntime.assertObject($__0),
      NodeContainer = $__13.NodeContainer,
      CompiledTemplate = $__13.CompiledTemplate;
  var $__13 = $traceurRuntime.assertObject($__1),
      Injector = $__13.Injector,
      TransientScope = $__13.TransientScope;
  var $__13 = $traceurRuntime.assertObject($__2),
      Inject = $__13.Inject,
      Provide = $__13.Provide;
  var $__13 = $traceurRuntime.assertObject($__3),
      View = $__13.View,
      ViewPort = $__13.ViewPort;
  var $__13 = $traceurRuntime.assertObject($__4),
      TemplateDirective = $__13.TemplateDirective,
      ComponentDirective = $__13.ComponentDirective,
      DecoratorDirective = $__13.DecoratorDirective,
      Directive = $__13.Directive,
      Queryable = $__13.Queryable;
  var ComponentLoader = $traceurRuntime.assertObject($__5).ComponentLoader;
  var Parser = $traceurRuntime.assertObject($__6).Parser;
  var $__13 = $traceurRuntime.assertObject($__7),
      WatchGroup = $__13.WatchGroup,
      childWatchGroupProviders = $__13.childWatchGroupProviders,
      isDomApi = $__13.isDomApi;
  var $__13 = $traceurRuntime.assertObject($__8),
      RootInjector = $__13.RootInjector,
      NodeInjector = $__13.NodeInjector;
  var reduceTree = $traceurRuntime.assertObject($__9).reduceTree;
  var $__13 = $traceurRuntime.assertObject($__10),
      valueProvider = $__13.valueProvider,
      getAnnotation = $__13.getAnnotation;
  var EXECUTION_CONTEXT_TOKEN = 'executionContext';
  var ViewFactory = function ViewFactory(componentLoader, rootInjector) {
    this.rootInjector = rootInjector;
    this.componentLoader = componentLoader;
  };
  ($traceurRuntime.createClass)(ViewFactory, {
    createComponentView: function($__13) {
      var element = "element" in $__13 ? $__13.element : null,
          component = $__13.component,
          providers = "providers" in $__13 ? $__13.providers : [],
          viewPort = $__13.viewPort;
      var annotation = getAnnotation(component, Directive);
      if (!element) {
        element = document.createElement(annotation.selector);
      }
      var nodeInjector = this._createComponent({
        element: element,
        component: component,
        providers: providers,
        parentNodeInjector: viewPort._anchorInjector
      });
      return new View([element], nodeInjector);
    },
    _createComponent: function($__14) {
      var element = $__14.element,
          component = $__14.component,
          providers = "providers" in $__14 ? $__14.providers : [],
          parentNodeInjector = $__14.parentNodeInjector;
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
    _initComponentDirective: function($__15) {
      var nodeInjector = $__15.nodeInjector,
          component = $__15.component,
          element = $__15.element;
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
    createChildView: function($__16) {
      var template = $__16.template,
          providers = "providers" in $__16 ? $__16.providers : [],
          viewPort = $__16.viewPort,
          executionContext = "executionContext" in $__16 ? $__16.executionContext : null;
      var localProviders = $traceurRuntime.spread(providers, childWatchGroupProviders());
      var childData = this._initTemplate({
        template: template,
        providers: localProviders,
        executionContext: executionContext,
        parentNodeInjector: viewPort._anchorInjector
      });
      return new View(childData.container.childNodes, childData.injector);
    },
    _initTemplate: function($__17) {
      var template = $__17.template,
          providers = $__17.providers,
          parentNodeInjector = $__17.parentNodeInjector,
          isShadowRoot = "isShadowRoot" in $__17 ? $__17.isShadowRoot : false,
          executionContext = "executionContext" in $__17 ? $__17.executionContext : null;
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
        var $__21;
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
            var $__21;
            ($__21 = localProviders).push.apply($__21, $traceurRuntime.spread([decorator], self._getDirectiveProviders(decorator)));
          }));
          if (element.ngInjectorFactory) {
            elementInjector = element.ngInjectorFactory(localProviders);
          } else if (binder.component) {
            elementInjector = self._createComponent({
              element: element,
              component: binder.component,
              providers: localProviders,
              parentInjector: parentInjector
            });
          } else {
            var template = binder.template;
            if (template) {
              ($__21 = localProviders).push.apply($__21, $traceurRuntime.spread([template.directive], self._getTemplateDirectiveProviders(element, template)));
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
      viewPortProvider.annotations = [new Provide(ViewPort), new Inject(NodeInjector)];
      return $traceurRuntime.spread([boundViewFactoryProvider, viewPortProvider], this._getDirectiveProviders(template.directive));
    }
  }, {});
  ViewFactory.annotations = [new Inject(ComponentLoader, RootInjector)];
  var BoundViewFactory = function BoundViewFactory($__18) {
    var viewFactory = $__18.viewFactory,
        template = $__18.template,
        viewPort = $__18.viewPort;
    this.viewFactory = viewFactory;
    this.template = template;
    this.viewPort = viewPort;
  };
  ($traceurRuntime.createClass)(BoundViewFactory, {createView: function() {
      var $__19 = $traceurRuntime.assertObject(arguments[0] !== (void 0) ? arguments[0] : {
        executionContext: null,
        providers: []
      }),
          executionContext = "executionContext" in $__19 ? $__19.executionContext : null,
          providers = "providers" in $__19 ? $__19.providers : [];
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
    contextWithExpressions.forEach((function($__19, index) {
      var context = $__19.context,
          expression = $__19.expression;
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
      assignableExpressions.forEach((function($__20, index) {
        var assignable = $__20.assignable,
            boundExpr = $__20.boundExpr;
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
            var $__21;
            for (var changeData = [],
                $__12 = 0; $__12 < arguments.length; $__12++)
              changeData[$__12] = arguments[$__12];
            return ($__21 = directiveInstance)[methodName].apply($__21, $traceurRuntime.toObject(changeData));
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
