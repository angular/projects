define(['templating', 'di', './router'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "routerViewPort";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var $__4 = $traceurRuntime.assertObject($__0),
      TemplateDirective = $__4.TemplateDirective,
      ViewPort = $__4.ViewPort,
      ViewFactory = $__4.ViewFactory,
      InitAttrs = $__4.InitAttrs;
  var $__4 = $traceurRuntime.assertObject($__1),
      Inject = $__4.Inject,
      Provide = $__4.Provide;
  var Router = $traceurRuntime.assertObject($__2).Router;
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
    getComponent: function(directive, createChildRouter) {
      createChildRouter.annotations = [new Provide(Router)];
      var component = this.viewFactory.createComponentView({
        component: directive,
        providers: [createChildRouter],
        viewPort: this.viewPort
      });
      component.executionContext = component.injector.get(directive);
      return component;
    },
    process: function(viewPortInstruction) {
      this.tryRemoveView();
      this.view = viewPortInstruction.component;
      this.view.appendTo(this.viewPort);
    },
    tryRemoveView: function() {
      if (this.view) {
        this.view.remove();
        this.view = null;
      }
    }
  }, {});
  RouterViewPort.annotations = [new TemplateDirective({selector: 'router-view-port'}), new Inject(ViewFactory, ViewPort, 'executionContext', InitAttrs)];
  return {
    get RouterViewPort() {
      return RouterViewPort;
    },
    __esModule: true
  };
});
