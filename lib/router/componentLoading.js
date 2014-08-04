define(["rtts-assert", './navigationPlan', './platformComponentLoader'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "componentLoading";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var $__4 = $traceurRuntime.assertObject($__1),
      REPLACE = $__4.REPLACE,
      buildNavigationPlan = $__4.buildNavigationPlan;
  var PlatformComponentLoader = $traceurRuntime.assertObject($__2).PlatformComponentLoader;
  var LoadNewComponentsStep = function LoadNewComponentsStep(componentLoader) {
    assert.argumentTypes(componentLoader, PlatformComponentLoader);
    this.componentLoader = componentLoader;
  };
  ($traceurRuntime.createClass)(LoadNewComponentsStep, {run: function(navigationContext, next) {
      return loadNewComponents(this.componentLoader, navigationContext).then(next).catch(next.cancel);
    }}, {});
  LoadNewComponentsStep.parameters = [[PlatformComponentLoader]];
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
    return resolveComponentView(componentLoader, navigationContext.router, viewPortPlan).then((function(component) {
      var viewPortInstruction = next.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, componentUrl, component);
      var controller = component.executionContext;
      if (controller.router) {
        var path = next.getWildcardPath();
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
  function resolveComponentView(componentLoader, router, viewPortPlan) {
    var possibleRouterViewPort = router.viewPorts[viewPortPlan.name];
    return componentLoader.loadComponent(viewPortPlan.config).then((function(directive) {
      return new Promise((function(resolve, reject) {
        function createChildRouter() {
          return router.createChild();
        }
        function getComponent(routerViewPort) {
          try {
            resolve(routerViewPort.getComponent(directive, createChildRouter));
          } catch (error) {
            reject(error);
          }
        }
        if (possibleRouterViewPort) {
          getComponent(possibleRouterViewPort);
        } else {
          router.viewPorts[viewPortPlan.name] = getComponent;
        }
      }));
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
