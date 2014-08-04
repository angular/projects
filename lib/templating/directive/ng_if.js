define(['../annotations', 'di', '../view_factory', '../view'], function($__0,$__1,$__2,$__3) {
  "use strict";
  var __moduleName = "ng_if";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var TemplateDirective = $traceurRuntime.assertObject($__0).TemplateDirective;
  var Inject = $traceurRuntime.assertObject($__1).Inject;
  var $__5 = $traceurRuntime.assertObject($__2),
      BoundViewFactory = $__5.BoundViewFactory,
      ViewPort = $__5.ViewPort,
      InitAttrs = $__5.InitAttrs;
  var ViewPort = $traceurRuntime.assertObject($__3).ViewPort;
  var NgIf = function NgIf(viewFactory, viewPort, attrs) {
    this.viewFactory = viewFactory;
    this.viewPort = viewPort;
    this.view = null;
    this.ngIf = attrs.ngIf === 'true';
  };
  ($traceurRuntime.createClass)(NgIf, {ngIfChanged: function(value) {
      if (!value && this.view) {
        this.view.remove();
        this.view = null;
      }
      if (value) {
        this.view = this.viewFactory.createView();
        this.view.appendTo(this.viewPort);
      }
    }}, {});
  NgIf.annotations = [new TemplateDirective({
    selector: '[ng-if]',
    bind: {'ngIf': 'ngIf'},
    observe: {'ngIf': 'ngIfChanged'}
  }), new Inject(BoundViewFactory, ViewPort, InitAttrs)];
  return {
    get NgIf() {
      return NgIf;
    },
    __esModule: true
  };
});
