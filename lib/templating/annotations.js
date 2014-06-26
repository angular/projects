define(["rtts-assert", 'rtts-assert', 'di'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "annotations";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var assert = $traceurRuntime.assertObject($__1).assert;
  var Inject = $traceurRuntime.assertObject($__2).Inject;
  var DirectiveArgs = function DirectiveArgs() {};
  ($traceurRuntime.createClass)(DirectiveArgs, {}, {assert: function(obj) {
      if (obj.selector) {
        assert(obj.selector).is(assert.string);
      }
      if (obj.observe) {
        for (var prop in obj.observe) {
          assert(obj.observe[prop]).is(assert.string);
        }
      }
      if (obj.bind) {
        for (var prop in obj.bind) {
          assert(obj.bind[prop]).is(assert.string);
        }
      }
      if (obj.on) {
        for (var prop in obj.on) {
          assert(obj.on[prop]).is(assert.string);
        }
      }
      if (obj.providers) {
        assert(obj.providers).is(assert.arrayOf(Function));
      }
    }});
  var Directive = function Directive() {
    var data = arguments[0] !== (void 0) ? arguments[0] : null;
    assert.argumentTypes(data, DirectiveArgs);
    if (data) {
      for (var prop in data) {
        this[prop] = data[prop];
      }
    }
  };
  ($traceurRuntime.createClass)(Directive, {}, {});
  Directive.parameters = [[DirectiveArgs]];
  var DecoratorDirective = function DecoratorDirective() {
    var data = arguments[0] !== (void 0) ? arguments[0] : null;
    assert.argumentTypes(data, DirectiveArgs);
    $traceurRuntime.superCall(this, $DecoratorDirective.prototype, "constructor", [data]);
  };
  var $DecoratorDirective = DecoratorDirective;
  ($traceurRuntime.createClass)(DecoratorDirective, {}, {}, Directive);
  DecoratorDirective.parameters = [[DirectiveArgs]];
  var TemplateDirective = function TemplateDirective() {
    var data = arguments[0] !== (void 0) ? arguments[0] : null;
    assert.argumentTypes(data, DirectiveArgs);
    $traceurRuntime.superCall(this, $TemplateDirective.prototype, "constructor", [data]);
  };
  var $TemplateDirective = TemplateDirective;
  ($traceurRuntime.createClass)(TemplateDirective, {}, {}, Directive);
  TemplateDirective.parameters = [[DirectiveArgs]];
  var ComponentArgs = function ComponentArgs() {};
  ($traceurRuntime.createClass)(ComponentArgs, {}, {assert: function(obj) {
      DirectiveArgs.assert(obj);
      if ('shadowDOM' in obj) {
        assert(obj.shadowDOM).is(assert.boolean);
      }
      if (obj.shadowProviders) {
        assert(obj.shadowProviders).is(assert.arrayOf(Function));
      }
    }});
  var ComponentDirective = function ComponentDirective() {
    var data = arguments[0] !== (void 0) ? arguments[0] : null;
    assert.argumentTypes(data, ComponentArgs);
    $traceurRuntime.superCall(this, $ComponentDirective.prototype, "constructor", [data]);
    this.moduleId = this.moduleId || null;
  };
  var $ComponentDirective = ComponentDirective;
  ($traceurRuntime.createClass)(ComponentDirective, {}, {}, Directive);
  ComponentDirective.parameters = [[ComponentArgs]];
  var QueryScope = {
    LIGHT: 'light',
    SHADOW: 'shadow',
    DEEP: 'deep',
    THIS: 'this'
  };
  var QueryListener = function QueryListener($__4) {
    var role = $__4.role,
        priority = "priority" in $__4 ? $__4.priority : 0,
        ordered = "ordered" in $__4 ? $__4.ordered : false;
    this.role = role;
    this.priority = priority;
    this.ordered = ordered;
  };
  ($traceurRuntime.createClass)(QueryListener, {}, {});
  var Queryable = function Queryable(role) {
    this.role = role;
  };
  ($traceurRuntime.createClass)(Queryable, {}, {});
  var ImplicitScope = function ImplicitScope() {};
  ($traceurRuntime.createClass)(ImplicitScope, {}, {});
  var AttachAware = function AttachAware() {
    $traceurRuntime.superCall(this, $AttachAware.prototype, "constructor", ['attachAware']);
  };
  var $AttachAware = AttachAware;
  ($traceurRuntime.createClass)(AttachAware, {}, {}, Queryable);
  var SystemAttachAware = function SystemAttachAware() {
    $traceurRuntime.superCall(this, $SystemAttachAware.prototype, "constructor", ['systemAttachAware']);
  };
  var $SystemAttachAware = SystemAttachAware;
  ($traceurRuntime.createClass)(SystemAttachAware, {}, {}, Queryable);
  return {
    get Directive() {
      return Directive;
    },
    get DecoratorDirective() {
      return DecoratorDirective;
    },
    get TemplateDirective() {
      return TemplateDirective;
    },
    get ComponentDirective() {
      return ComponentDirective;
    },
    get QueryScope() {
      return QueryScope;
    },
    get QueryListener() {
      return QueryListener;
    },
    get Queryable() {
      return Queryable;
    },
    get ImplicitScope() {
      return ImplicitScope;
    },
    get AttachAware() {
      return AttachAware;
    },
    get SystemAttachAware() {
      return SystemAttachAware;
    },
    __esModule: true
  };
});
