define(['templating', 'di'], function($__0,$__1) {
  "use strict";
  var __moduleName = "ng_active";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var DecoratorDirective = $traceurRuntime.assertObject($__0).DecoratorDirective;
  var Inject = $traceurRuntime.assertObject($__1).Inject;
  var NgActive = function NgActive(element) {
    this.element = element;
  };
  ($traceurRuntime.createClass)(NgActive, {ngActiveChanged: function(value) {
      if (value) {
        this.element.classList.add('active');
      } else {
        this.element.classList.remove('active');
      }
    }}, {});
  NgActive.annotations = [new DecoratorDirective({
    selector: '[ng-active]',
    bind: {'ngActive': 'ngActive'},
    observe: {'ngActive': 'ngActiveChanged'}
  }), new Inject(Node)];
  return {
    get NgActive() {
      return NgActive;
    },
    __esModule: true
  };
});
