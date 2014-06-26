define(['./util', './history', './router', 'di', './pipelineProvider', './navigationCommand'], function($__0,$__1,$__2,$__3,$__4,$__5) {
  "use strict";
  var __moduleName = "appRouter";
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
  var extend = $traceurRuntime.assertObject($__0).extend;
  var History = $traceurRuntime.assertObject($__1).History;
  var Router = $traceurRuntime.assertObject($__2).Router;
  var $__8 = $traceurRuntime.assertObject($__3),
      Inject = $__8.Inject,
      Provide = $__8.Provide;
  var PipelineProvider = $traceurRuntime.assertObject($__4).PipelineProvider;
  var isNavigationCommand = $traceurRuntime.assertObject($__5).isNavigationCommand;
  var AppRouter = function AppRouter(history, pipelineProvider) {
    $traceurRuntime.superCall(this, $AppRouter.prototype, "constructor", [history]);
    this.pipelineProvider = pipelineProvider;
    document.addEventListener('click', handleLinkClick.bind(this), true);
  };
  var $AppRouter = AppRouter;
  ($traceurRuntime.createClass)(AppRouter, {
    loadUrl: function(url) {
      var $__6 = this;
      return this.createNavigationInstruction(url).then((function(instruction) {
        return $__6.queueInstruction(instruction);
      })).catch((function(error) {
        console.error(error);
        if ($__6.history.previousFragment) {
          $__6.navigate($__6.history.previousFragment, false);
        }
      }));
    },
    queueInstruction: function(instruction) {
      var $__6 = this;
      return new Promise((function(resolve) {
        instruction.resolve = resolve;
        $__6.queue.unshift(instruction);
        $__6.dequeueInstruction();
      }));
    },
    dequeueInstruction: function() {
      var $__6 = this;
      if (this.isNavigating) {
        return;
      }
      var instruction = this.queue.shift();
      this.queue = [];
      if (!instruction) {
        return;
      }
      this.isNavigating = true;
      var context = this.createNavigationContext(instruction);
      var pipeline = this.pipelineProvider.createPipeline(context);
      pipeline.run(context).then((function(result) {
        $__6.isNavigating = false;
        if (result.completed) {
          $__6.history.previousFragment = instruction.fragment;
        }
        if (result.output instanceof Error) {
          console.error(result.output);
        }
        if (isNavigationCommand(result.output)) {
          result.output.navigate($__6);
        } else if (!result.completed && $__6.history.previousFragment) {
          $__6.navigate($__6.history.previousFragment, false);
        }
        instruction.resolve(result);
        $__6.dequeueInstruction();
      }));
    },
    registerViewPort: function(viewPort, name) {
      $traceurRuntime.superCall(this, $AppRouter.prototype, "registerViewPort", [viewPort, name]);
      if (!this.isActive) {
        this.activate();
      } else {
        this.dequeueInstruction();
      }
    },
    activate: function(options) {
      if (this.isActive) {
        return;
      }
      this.isActive = true;
      this.options = extend({routeHandler: this.loadUrl.bind(this)}, this.options, options);
      this.history.activate(this.options);
      this.dequeueInstruction();
    },
    deactivate: function() {
      this.isActive = false;
      this.history.deactivate();
    },
    reset: function() {
      $traceurRuntime.superCall(this, $AppRouter.prototype, "reset", []);
      this.queue = [];
      delete this.options;
    }
  }, {}, Router);
  AppRouter.annotations = [new Provide(Router), new Provide(AppRouter), new Inject(History, PipelineProvider)];
  function handleLinkClick(evt) {
    if (!this.isActive) {
      return;
    }
    var target = evt.target;
    if (target.tagName != 'A') {
      return;
    }
    if (this.history._hasPushState) {
      if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && targetIsThisWindow(target)) {
        var href = target.getAttribute('href');
        if (href != null && !(href.charAt(0) === "#" || (/^[a-z]+:/i).test(href))) {
          evt.preventDefault();
          this.history.navigate(href);
        }
      }
    }
  }
  function targetIsThisWindow(target) {
    var targetWindow = target.getAttribute('target');
    return !targetWindow || targetWindow === window.name || targetWindow === '_self' || (targetWindow === 'top' && window === window.top);
  }
  return {
    get AppRouter() {
      return AppRouter;
    },
    __esModule: true
  };
});
