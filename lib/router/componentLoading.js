define(['./navigationPlan', './util', './router', 'di', 'templating'], function($__0,$__1,$__2,$__3,$__4) {
  "use strict";
  var __moduleName = "componentLoading";
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
  var $__6 = $traceurRuntime.assertObject($__0),
      REPLACE = $__6.REPLACE,
      buildNavigationPlan = $__6.buildNavigationPlan;
  var getWildcardPath = $traceurRuntime.assertObject($__1).getWildcardPath;
  var Router = $traceurRuntime.assertObject($__2).Router;
  var $__6 = $traceurRuntime.assertObject($__3),
      Provide = $__6.Provide,
      Inject = $__6.Inject;
  var ComponentLoader = $traceurRuntime.assertObject($__4).ComponentLoader;
  var LoadNewComponentsStep = function LoadNewComponentsStep(componentLoader) {
    this.componentLoader = componentLoader;
  };
  ($traceurRuntime.createClass)(LoadNewComponentsStep, {run: function(navigationContext, next) {
      return loadNewComponents(this.componentLoader, navigationContext).then(next).catch(next.cancel);
    }}, {});
  LoadNewComponentsStep.annotations = [new Inject(ComponentLoader)];
  function loadNewComponents(componentLoader, navigationContext) {
    var toLoad = determineWhatToLoad(navigationContext);
    var loadPromises = toLoad.map((function(current) {
      return loadComponent(componentLoader, current.navigationContext, current.viewPortPlan);
    }));
    return Promise.all(loadPromises);
  }
  function determineWhatToLoad(navigationContext, toLoad) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;
    toLoad = toLoad || [];
    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];
      if (viewPortPlan.strategy == REPLACE) {
        toLoad.push({
          viewPortPlan: viewPortPlan,
          navigationContext: navigationContext
        });
        if (viewPortPlan.childNavigationContext) {
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      } else {
        var viewPortInstruction = next.addViewPortInstruction(viewPortName, viewPortPlan.strategy, viewPortPlan.prevComponentUrl, viewPortPlan.prevComponent);
        if (viewPortPlan.childNavigationContext) {
          viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      }
    }
    return toLoad;
  }
  function loadComponent(componentLoader, navigationContext, viewPortPlan) {
    var componentUrl = viewPortPlan.config.componentUrl;
    var next = navigationContext.nextInstruction;
    return resolveComponentInstance(componentLoader, navigationContext.router, viewPortPlan).then((function(component) {
      component.executionContext = component._injector._children[0].get('executionContext');
      var viewPortInstruction = next.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, componentUrl, component);
      var controller = component.executionContext;
      if (controller.router) {
        var path = getWildcardPath(next.config.pattern, next.params, next.queryString);
        return controller.router.createNavigationInstruction(path, next).then((function(childInstruction) {
          viewPortPlan.childNavigationContext = controller.router.createNavigationContext(childInstruction);
          return buildNavigationPlan(viewPortPlan.childNavigationContext).then((function(childPlan) {
            viewPortPlan.childNavigationContext.plan = childPlan;
            viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
            return loadNewComponents(componentLoader, viewPortPlan.childNavigationContext);
          }));
        }));
      }
    }));
  }
  function resolveComponentInstance(componentLoader, router, viewPortPlan) {
    var possibleRouterViewPort = router.viewPorts[viewPortPlan.name],
        url = viewPortPlan.config.componentUrl;
    if (url.indexOf('.html') == -1) {
      url += '.html';
    }
    return new Promise((function(resolve, reject) {
      componentLoader.loadFromTemplateUrl({
        templateUrl: url,
        done: (function($__6) {
          var directive = $__6.directive;
          function childRouterProvider() {
            return router.createChild();
          }
          childRouterProvider.annotations = [new Provide(Router)];
          function createComponent(routerViewPort) {
            try {
              var component = routerViewPort.getComponentInstance(directive, [childRouterProvider]);
              resolve(component);
            } catch (error) {
              reject(error);
            }
          }
          if (possibleRouterViewPort) {
            createComponent(possibleRouterViewPort);
          } else {
            router.viewPorts[viewPortPlan.name] = createComponent;
          }
        })
      });
    }));
  }
  return {
    get LoadNewComponentsStep() {
      return LoadNewComponentsStep;
    },
    get loadNewComponents() {
      return loadNewComponents;
    },
    __esModule: true
  };
});
