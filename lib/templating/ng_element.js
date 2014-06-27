define(['./di/ce_di', './annotations', './view_factory', './component_loader', './util/annotation_provider', 'di', './di/node_injector'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6) {
  "use strict";
  var __moduleName = "ng_element";
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
  var mixinCustomElementDi = $traceurRuntime.assertObject($__0).mixinCustomElementDi;
  var ComponentDirective = $traceurRuntime.assertObject($__1).ComponentDirective;
  var ViewFactory = $traceurRuntime.assertObject($__2).ViewFactory;
  var ComponentLoader = $traceurRuntime.assertObject($__3).ComponentLoader;
  var AnnotationProvider = $traceurRuntime.assertObject($__4).AnnotationProvider;
  var $__7 = $traceurRuntime.assertObject($__5),
      Inject = $__7.Inject,
      TransientScope = $__7.TransientScope;
  var RootInjector = $traceurRuntime.assertObject($__6).RootInjector;
  function registerNgElement(annotationProvider, componentLoader, registerCustomElement) {
    var ngElementProto = Object.create(HTMLElement.prototype);
    ngElementProto.createdCallback = createdCallback;
    return document.registerElement('ng-element', {prototype: ngElementProto});
    function createdCallback() {
      var templateElement = this.querySelector('template');
      componentLoader.loadFromElement(templateElement, (function($__7) {
        var template = $__7.template,
            directive = $__7.directive;
        registerCustomElement(document, directive, template);
      }));
    }
  }
  registerNgElement.annotations = [new Inject(AnnotationProvider, ComponentLoader, RegisterCustomElement), new TransientScope];
  function RegisterCustomElement(annotationProvider, viewFactory, rootInjector) {
    return function(document, component, template) {
      var proto = Object.create(HTMLElement.prototype);
      proto.createdCallback = createdCallback;
      var annotation = annotationProvider(component, ComponentDirective);
      component.prototype.__proto__ = proto;
      mixinCustomElementDi({
        type: component,
        providers: viewFactory._getComponentProviders(component),
        callbacks: {
          created: 'createdCallback',
          attached: 'attachedCallback',
          detached: 'detachedCallback'
        },
        rootInjector: rootInjector
      });
      document.registerElement(annotation.selector, {prototype: component.prototype});
      function createdCallback() {
        viewFactory._initComponentDirective({
          component: component,
          element: this,
          nodeInjector: this.ngData.injector
        });
      }
      ;
    };
  }
  RegisterCustomElement.annotations = [new Inject(AnnotationProvider, ViewFactory, RootInjector)];
  return {
    get registerNgElement() {
      return registerNgElement;
    },
    __esModule: true
  };
});
