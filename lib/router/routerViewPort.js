define(['templating', 'di'], function($__0,$__1) {
  "use strict";
  var __moduleName = "routerViewPort";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var $__3 = $traceurRuntime.assertObject($__0),
      TemplateDirective = $__3.TemplateDirective,
      View = $__3.View,
      ViewPort = $__3.ViewPort,
      ViewFactory = $__3.ViewFactory,
      InitAttrs = $__3.InitAttrs;
  var $__3 = $traceurRuntime.assertObject($__1),
      Injector = $__3.Injector,
      Inject = $__3.Inject;
  var RouterViewPort = function RouterViewPort(viewFactory, viewPort, executionContext, attrs) {
    this.viewFactory = viewFactory;
    this.viewPort = viewPort;
    this.executionContext = executionContext;
    this.view = null;
    if ('router' in this.executionContext) {
      this.executionContext.router.registerViewPort(this, attrs.name);
    }
  };
  ($traceurRuntime.createClass)(RouterViewPort, {
    createComponentView: function(directive, providers) {
      return this.viewFactory.createComponentView({
        component: directive,
        providers: providers,
        viewPort: this.viewPort
      });
    },
    process: function(viewPortInstruction) {
      this.tryRemoveView();
      this.view = viewPortInstruction.component;
      this.viewPort.append(this.view);
    },
    tryRemoveView: function() {
      if (this.view) {
        this.view.remove();
        this.view = null;
      }
    }
  }, {});
  RouterViewPort.annotations = [new TemplateDirective({selector: 'router-view-port'}), new Inject(ViewFactory, ViewPort, 'executionContext', Injector, InitAttrs)];
  return {
    get RouterViewPort() {
      return RouterViewPort;
    },
    __esModule: true
  };
});
