define(['./navigationPlan', './navigationCommand', './util'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "activation";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var $__4 = $traceurRuntime.assertObject($__0),
      INVOKE_LIFECYCLE = $__4.INVOKE_LIFECYCLE,
      REPLACE = $__4.REPLACE;
  var isNavigationCommand = $traceurRuntime.assertObject($__1).isNavigationCommand;
  var processPotential = $traceurRuntime.assertObject($__2).processPotential;
  var affirmations = ['yes', 'ok', 'true'];
  var CanDeactivatePreviousStep = function CanDeactivatePreviousStep() {};
  ($traceurRuntime.createClass)(CanDeactivatePreviousStep, {run: function(navigationContext, next) {
      return processDeactivatable(navigationContext.plan, 'canDeactivate', next);
    }}, {});
  var CanActivateNextStep = function CanActivateNextStep() {};
  ($traceurRuntime.createClass)(CanActivateNextStep, {run: function(navigationContext, next) {
      return processActivatable(navigationContext, 'canActivate', next);
    }}, {});
  var DeactivatePreviousStep = function DeactivatePreviousStep() {};
  ($traceurRuntime.createClass)(DeactivatePreviousStep, {run: function(navigationContext, next) {
      return processDeactivatable(navigationContext.plan, 'deactivate', next, true);
    }}, {});
  var ActivateNextStep = function ActivateNextStep() {};
  ($traceurRuntime.createClass)(ActivateNextStep, {run: function(navigationContext, next) {
      return processActivatable(navigationContext, 'activate', next, true);
    }}, {});
  function processDeactivatable(plan, callbackName, next, ignoreResult) {
    var infos = findDeactivatable(plan, callbackName),
        i = infos.length;
    function inspect(val) {
      if (ignoreResult || shouldContinue(val)) {
        return iterate();
      } else {
        return next.cancel(val);
      }
    }
    function iterate() {
      if (i--) {
        try {
          var controller = infos[i];
          var result = controller[callbackName]();
          return processPotential(result, inspect, next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      } else {
        return next();
      }
    }
    return iterate();
  }
  function findDeactivatable(plan, callbackName, list) {
    list = list || [];
    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];
      var prevComponent = viewPortPlan.prevComponent;
      if ((viewPortPlan.strategy == INVOKE_LIFECYCLE || viewPortPlan.strategy == REPLACE) && prevComponent) {
        var controller = prevComponent.executionContext;
        if (callbackName in controller) {
          list.push(controller);
        }
      }
      if (viewPortPlan.childNavigationContext) {
        findDeactivatable(viewPortPlan.childNavigationContext.plan, callbackName, list);
      } else if (prevComponent) {
        addPreviousDeactivatable(prevComponent, callbackName, list);
      }
    }
    return list;
  }
  function addPreviousDeactivatable(component, callbackName, list) {
    var controller = component.executionContext;
    if (controller.router && controller.router.currentInstruction) {
      var viewPortInstructions = controller.router.currentInstruction.viewPortInstructions;
      for (var viewPortName in viewPortInstructions) {
        var viewPortInstruction = viewPortInstructions[viewPortName];
        var prevComponent = viewPortInstruction.component;
        var prevController = prevComponent.executionContext;
        if (callbackName in prevController) {
          list.push(prevController);
        }
        addPreviousDeactivatable(prevComponent, callbackName, list);
      }
    }
  }
  function processActivatable(navigationContext, callbackName, next, ignoreResult) {
    var infos = findActivatable(navigationContext, callbackName),
        length = infos.length,
        i = -1;
    function inspect(val, router) {
      if (ignoreResult || shouldContinue(val, router)) {
        return iterate();
      } else {
        return next.cancel(val);
      }
    }
    function iterate() {
      var $__5;
      i++;
      if (i < length) {
        try {
          var current = infos[i];
          var result = ($__5 = current.controller)[callbackName].apply($__5, $traceurRuntime.toObject(current.lifecycleArgs));
          return processPotential(result, (function(val) {
            return inspect(val, current.router);
          }), next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      } else {
        return next();
      }
    }
    return iterate();
  }
  function findActivatable(navigationContext, callbackName, list, router) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;
    list = list || [];
    Object.keys(plan).filter((function(viewPortName) {
      var viewPortPlan = plan[viewPortName];
      var viewPortInstruction = next.viewPortInstructions[viewPortName];
      var controller = viewPortInstruction.component.executionContext;
      if ((viewPortPlan.strategy === INVOKE_LIFECYCLE || viewPortPlan.strategy === REPLACE) && callbackName in controller) {
        list.push({
          controller: controller,
          lifecycleArgs: viewPortInstruction.lifecycleArgs,
          router: router
        });
      }
      if (viewPortPlan.childNavigationContext) {
        findActivatable(viewPortPlan.childNavigationContext, callbackName, list, controller.router || router);
      }
    }));
    return list;
  }
  function shouldContinue(output, router) {
    if (output instanceof Error) {
      return false;
    }
    if (isNavigationCommand(output)) {
      output.router = router;
      return !!output.shouldContinueProcessing;
    }
    if (typeof output == 'string') {
      return affirmations.indexOf(value.toLowerCase()) !== -1;
    }
    if (typeof output == 'undefined') {
      return true;
    }
    return output;
  }
  return {
    get affirmations() {
      return affirmations;
    },
    get CanDeactivatePreviousStep() {
      return CanDeactivatePreviousStep;
    },
    get CanActivateNextStep() {
      return CanActivateNextStep;
    },
    get DeactivatePreviousStep() {
      return DeactivatePreviousStep;
    },
    get ActivateNextStep() {
      return ActivateNextStep;
    },
    __esModule: true
  };
});
