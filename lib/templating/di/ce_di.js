define(['di'], function($__0) {
  "use strict";
  var __moduleName = "ce_di";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var Provide = $traceurRuntime.assertObject($__0).Provide;
  function mixinCustomElementDi($__1) {
    var type = $__1.type,
        providers = "providers" in $__1 ? $__1.providers : [],
        callbacks = $__1.callbacks,
        rootInjector = $__1.rootInjector;
    var proto = type.prototype;
    var _createdCallback = proto[callbacks.created];
    var _attachedCallback = proto[callbacks.attached];
    var _detachedCallback = proto[callbacks.detached];
    proto[callbacks.created] = created;
    proto[callbacks.attached] = attached;
    proto[callbacks.detached] = detached;
    return proto;
    function created() {
      var self = this;
      function proxy() {
        type.apply(self, arguments);
        return self;
      }
      proxy.annotations = type.annotations || [];
      proxy.annotations.push(new Provide(type));
      proxy.parameters = type.parameters;
      var localProviders = $traceurRuntime.spread([proxy], providers);
      if (this.classList.contains('ng-binder')) {
        this.ngInjectorFactory = injectorFactory;
      } else {
        injectorFactory([]);
      }
      function injectorFactory() {
        var $__2;
        var extraProviders = arguments[0] !== (void 0) ? arguments[0] : [];
        ($__2 = localProviders).push.apply($__2, $traceurRuntime.toObject(extraProviders));
        var injector = rootInjector.createChild({
          node: self,
          providers: localProviders,
          isShadowRoot: false
        });
        injector.get(type);
        self.ngData = {
          lastParent: null,
          lastPrevious: null,
          injector: injector
        };
        if (_createdCallback) {
          _createdCallback.call(self);
        }
        return injector;
      }
    }
    function attached() {
      var injector = this.ngData.injector;
      var parentNode = this.parentNode,
          previousSibling = this.previousSibling;
      var parentChanged = !injector._parent || (parentNode !== this.ngData.lastParent);
      this.ngData.lastParent = parentNode;
      var moved = previousSibling !== this.ngData.previousSibling;
      this.ngData.lastPrevious = previousSibling;
      if (!parentChanged && !moved) {
        return;
      }
      injector.nodeMoved(parentChanged);
      if (_attachedCallback) {
        _attachedCallback.call(this);
      }
    }
    function detached() {
      if (!this.parentNode) {
        this.ngData.lastParent = null;
        this.ngData.lastPrevious = null;
        this.ngData.injector.remove();
      }
      if (_detachedCallback) {
        _detachedCallback.call(this);
      }
    }
  }
  return {
    get mixinCustomElementDi() {
      return mixinCustomElementDi;
    },
    __esModule: true
  };
});
