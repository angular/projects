define([], function() {
  "use strict";
  var __moduleName = "navigationPlan";
  var NO_CHANGE = 'no-change';
  var INVOKE_LIFECYCLE = 'invoke-lifecycle';
  var REPLACE = 'replace';
  function buildNavigationPlan(navigationContext, forceLifecycleMinimum) {
    var $__1;
    var prev = navigationContext.prevInstruction;
    var next = navigationContext.nextInstruction;
    var plan = {};
    if (prev) {
      var newParams = hasDifferentParameterValues(prev, next);
      var pending = [];
      for (var viewPortName in prev.viewPortInstructions) {
        var prevViewPortInstruction = prev.viewPortInstructions[viewPortName];
        var nextViewPortConfig = next.config.viewPorts[viewPortName];
        var viewPortPlan = plan[viewPortName] = {
          name: viewPortName,
          config: nextViewPortConfig,
          prevComponent: prevViewPortInstruction.component,
          prevComponentUrl: prevViewPortInstruction.componentUrl
        };
        if (prevViewPortInstruction.componentUrl != nextViewPortConfig.componentUrl) {
          viewPortPlan.strategy = REPLACE;
        } else if ('determineActivationStrategy' in prevViewPortInstruction.component.executionContext) {
          viewPortPlan.strategy = ($__1 = prevViewPortInstruction.component.executionContext).determineActivationStrategy.apply($__1, $traceurRuntime.toObject(next.lifecycleArgs));
        } else if (newParams || forceLifecycleMinimum) {
          viewPortPlan.strategy = INVOKE_LIFECYCLE;
        } else {
          viewPortPlan.strategy = NO_CHANGE;
        }
        if (viewPortPlan.strategy !== REPLACE && prevViewPortInstruction.childRouter) {
          var path = next.getWildcardPath();
          var task = prevViewPortInstruction.childRouter.createNavigationInstruction(path, next).then((function(childInstruction) {
            viewPortPlan.childNavigationContext = prevViewPortInstruction.childRouter.createNavigationContext(childInstruction);
            return buildNavigationPlan(viewPortPlan.childNavigationContext, viewPortPlan.strategy == INVOKE_LIFECYCLE).then((function(childPlan) {
              viewPortPlan.childNavigationContext.plan = childPlan;
            }));
          }));
          pending.push(task);
        }
      }
      return Promise.all(pending).then((function() {
        return plan;
      }));
    } else {
      for (var viewPortName in next.config.viewPorts) {
        plan[viewPortName] = {
          name: viewPortName,
          strategy: REPLACE,
          config: next.config.viewPorts[viewPortName]
        };
      }
      return Promise.resolve(plan);
    }
  }
  var BuildNavigationPlanStep = function BuildNavigationPlanStep() {};
  ($traceurRuntime.createClass)(BuildNavigationPlanStep, {run: function(navigationContext, next) {
      return buildNavigationPlan(navigationContext).then((function(plan) {
        navigationContext.plan = plan;
        return next();
      })).catch(next.cancel);
    }}, {});
  function hasDifferentParameterValues(prev, next) {
    var prevParams = prev.params,
        nextParams = next.params,
        nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;
    for (var key in nextParams) {
      if (key == nextWildCardName) {
        continue;
      }
      if (prevParams[key] != nextParams[key]) {
        return true;
      }
    }
    return false;
  }
  return {
    get NO_CHANGE() {
      return NO_CHANGE;
    },
    get INVOKE_LIFECYCLE() {
      return INVOKE_LIFECYCLE;
    },
    get REPLACE() {
      return REPLACE;
    },
    get buildNavigationPlan() {
      return buildNavigationPlan;
    },
    get BuildNavigationPlanStep() {
      return BuildNavigationPlanStep;
    },
    __esModule: true
  };
});
