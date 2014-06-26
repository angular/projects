define(['./navigationPlan'], function($__0) {
  "use strict";
  var __moduleName = "navigationContext";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var REPLACE = $traceurRuntime.assertObject($__0).REPLACE;
  var NavigationContext = function NavigationContext(router, nextInstruction) {
    this.router = router;
    this.nextInstruction = nextInstruction;
    this.currentInstruction = router.currentInstruction;
    this.prevInstruction = router.currentInstruction;
  };
  ($traceurRuntime.createClass)(NavigationContext, {
    commitChanges: function() {
      var next = this.nextInstruction,
          prev = this.prevInstruction,
          viewPortInstructions = next.viewPortInstructions,
          router = this.router;
      router.currentInstruction = next;
      if (prev) {
        prev.config.navModel.isActive = false;
      }
      next.config.navModel.isActive = true;
      router.refreshBaseUrl();
      router.refreshNavigation();
      for (var viewPortName in viewPortInstructions) {
        var viewPortInstruction = viewPortInstructions[viewPortName];
        var viewPort = router.viewPorts[viewPortName];
        if (viewPortInstruction.strategy === REPLACE) {
          viewPort.process(viewPortInstruction);
        }
        if ('childNavigationContext' in viewPortInstruction) {
          viewPortInstruction.childNavigationContext.commitChanges();
        }
      }
    },
    buildTitle: function() {
      var separator = arguments[0] !== (void 0) ? arguments[0] : ' | ';
      var next = this.nextInstruction,
          title = next.config.navModel.title || '',
          viewPortInstructions = next.viewPortInstructions,
          childTitles = [];
      for (var viewPortName in viewPortInstructions) {
        var viewPortInstruction = viewPortInstructions[viewPortName];
        if ('childNavigationContext' in viewPortInstruction) {
          var childTitle = viewPortInstruction.childNavigationContext.buildTitle(separator);
          if (childTitle) {
            childTitles.push(childTitle);
          }
        }
      }
      if (childTitles.length) {
        title = childTitles.join(separator) + (title ? separator : '') + title;
      }
      if (this.router.title) {
        title += (title ? separator : '') + this.router.title;
      }
      return title;
    }
  }, {});
  var CommitChangesStep = function CommitChangesStep() {};
  ($traceurRuntime.createClass)(CommitChangesStep, {run: function(navigationContext, next) {
      navigationContext.commitChanges();
      var title = navigationContext.buildTitle();
      if (title) {
        document.title = title;
      }
      return next();
    }}, {});
  return {
    get NavigationContext() {
      return NavigationContext;
    },
    get CommitChangesStep() {
      return CommitChangesStep;
    },
    __esModule: true
  };
});
