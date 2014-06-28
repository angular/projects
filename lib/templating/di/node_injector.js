define(["rtts-assert", 'di', '../annotations', '../util/misc'], function($__0,$__1,$__2,$__3) {
  "use strict";
  var __moduleName = "node_injector";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var $__5 = $traceurRuntime.assertObject($__1),
      Injector = $__5.Injector,
      Provide = $__5.Provide,
      TransientScope = $__5.TransientScope,
      Inject = $__5.Inject;
  var $__5 = $traceurRuntime.assertObject($__2),
      Queryable = $__5.Queryable,
      QueryListener = $__5.QueryListener,
      QueryScope = $__5.QueryScope,
      ImplicitScope = $__5.ImplicitScope;
  var $__5 = $traceurRuntime.assertObject($__3),
      valueProvider = $__5.valueProvider,
      getAnnotation = $__5.getAnnotation;
  var nextId = 0;
  var NodeInjector = function NodeInjector() {
    var $__5 = $traceurRuntime.assertObject(arguments[0] !== (void 0) ? arguments[0] : {}),
        node = $__5.node,
        providers = "providers" in $__5 ? $__5.providers : [],
        root = "root" in $__5 ? $__5.root : null,
        isShadowRoot = "isShadowRoot" in $__5 ? $__5.isShadowRoot : false,
        parent = "parent" in $__5 ? $__5.parent : null;
    if (node) {
      if (node.ngInjector) {
        throw new Error('There can only be one NodeInjector per node: ' + node);
      }
      node.ngInjector = this;
    }
    this._id = '' + (nextId++);
    this._node = node;
    this._children = [];
    this._root = root;
    this._isShadowRoot = isShadowRoot;
    this._queries = {};
    this._queryables = {};
    this._subtreeQueryables = {};
    this._createDelegate($traceurRuntime.spread([valueProvider(Node, node), valueProvider($NodeInjector, this)], providers), parent ? parent._delegate : null);
    this._parent = null;
  };
  var $NodeInjector = NodeInjector;
  ($traceurRuntime.createClass)(NodeInjector, {
    createChild: function($__5) {
      var node = $__5.node,
          providers = $__5.providers,
          isShadowRoot = "isShadowRoot" in $__5 ? $__5.isShadowRoot : false;
      return new $NodeInjector({
        node: node,
        providers: providers,
        root: this._root,
        isShadowRoot: isShadowRoot,
        parent: this
      });
    },
    _createDelegate: function(providers, parent) {
      var self = this;
      this._delegate = new Injector(providers, parent, new Map(), [TransientScope, ImplicitScope]);
      this._delegate._providers.forEach((function(provider, token) {
        searchAndAddAnnotations(provider.provider, token);
        provider.params.forEach((function(param) {
          if (typeof param.token === 'function' && getAnnotation(param.token, ImplicitScope)) {
            searchAndAddAnnotations(null, param.token);
          }
        }));
      }));
      function searchAndAddAnnotations(provider, token) {
        var source = provider && provider !== token ? provider : token;
        if (!source.annotations) {
          return;
        }
        source.annotations.forEach((function(annotation) {
          if (annotation instanceof Queryable) {
            addQueryable(annotation.role, self._delegate.get(token));
          } else if (annotation instanceof QueryListener) {
            addQueryListener(annotation, self._delegate.get(token));
          }
        }));
      }
      function addQueryable(role, instance) {
        var entry = self._queryables[role];
        if (!entry) {
          entry = self._queryables[role] = [];
          self._subtreeQueryables[role] = 0;
        }
        entry.push(instance);
        self._subtreeQueryables[role]++;
      }
      function addQueryListener($__6, callback) {
        var role = $__6.role,
            ordered = $__6.ordered;
        var query = self._queries[role] = {
          role: role,
          ordered: ordered
        };
        query.changed = function(sourceInjector, incDec) {
          callback.queryChanged(sourceInjector, incDec);
        };
      }
    },
    insertBefore: function(ref) {
      assert.argumentTypes(ref, $NodeInjector);
      this._insert(ref._parent, ref._parent._children.indexOf(ref));
    },
    insertAfter: function(ref) {
      assert.argumentTypes(ref, $NodeInjector);
      this._insert(ref._parent, ref._parent._children.indexOf(ref) + 1);
    },
    appendTo: function(parent) {
      assert.argumentTypes(parent, $NodeInjector);
      this._insert(parent, parent._children.length);
    },
    nodeMoved: function(parentChanged) {
      assert.argumentTypes(parentChanged, $traceurRuntime.type.boolean);
      var parent = this._parent;
      if (parentChanged) {
        parent = $NodeInjector.find(this._node.parentNode);
      }
      for (var i = 0; i < parent._children.length; i++) {
        var child = parent._children[i];
        if (this._node.compareDocumentPosition(child._node) & Node.DOCUMENT_POSITION_FOLLOWING) {
          break;
        }
      }
      this._insert(parent, i);
    },
    remove: function() {
      if (!this._parent) {
        return;
      }
      this._adjustQueryablesInParents(-1);
      var index = this._parent._children.indexOf(this);
      this._parent._children.splice(index, 1);
      this._parent = null;
    },
    get: function(token) {
      return this._delegate.get(token);
    },
    _insert: function(parent, index) {
      if (parent === this._parent) {
        var oldIndex = parent._children.indexOf(this);
        if (oldIndex !== -1) {
          parent._children.splice(oldIndex, 1);
        }
        parent._children.splice(index, 0, this);
        this._adjustQueryablesInParents(0);
      } else {
        this.remove();
        this._parent = parent;
        this._cloneDelegateWithNewParent();
        parent._children.splice(index, 0, this);
        this._adjustQueryablesInParents(1);
      }
    },
    _cloneDelegateWithNewParent: function() {
      if (this._delegate._parent === this._parent._delegate) {
        return;
      }
      var source = this._delegate;
      var clone = Object.create(Injector.prototype);
      clone._cache = source._cache;
      clone._providers = source._providers;
      clone._scopes = source._scopes;
      clone._parent = this._parent._delegate;
      this._delegate = clone;
      this._children.forEach((function(childInjector) {
        childInjector._cloneDelegateWithNewParent();
      }));
      return clone;
    },
    _adjustQueryablesInParents: function(inc) {
      var roles = arguments[1] !== (void 0) ? arguments[1] : null;
      if (!roles) {
        roles = this._subtreeQueryables;
      }
      var parent = this;
      while (parent) {
        for (var role in this._subtreeQueryables) {
          if (inc) {
            var counter = parent._subtreeQueryables[role] || 0;
            parent._subtreeQueryables[role] = counter + inc;
          }
          var query = parent._queries[role];
          if (query) {
            query.changed(this, inc);
          }
        }
        parent = parent._parent;
      }
    },
    _findQueryables: function($__6) {
      var role = $__6.role,
          scope = "scope" in $__6 ? $__6.scope : QueryScope.DEEP,
          result = "result" in $__6 ? $__6.result : [];
      if (scope === QueryScope.THIS || scope === QueryScope.LIGHT || scope === QueryScope.DEEP) {
        var instances = this._queryables[role];
        if (instances) {
          result.push({
            injector: this,
            instances: instances
          });
        }
      }
      this._children.forEach((function(child) {
        if (!child._subtreeQueryables[role]) {
          return;
        }
        var recurse = false;
        var recurseScope = scope;
        if (child._isShadowRoot) {
          if (scope === QueryScope.SHADOW || scope === QueryScope.DEEP) {
            recurse = true;
            if (scope === QueryScope.SHADOW) {
              recurseScope = QueryScope.LIGHT;
            }
          }
        } else if (scope === QueryScope.LIGHT || scope === QueryScope.DEEP) {
          recurse = true;
        }
        if (recurse) {
          child._findQueryables({
            role: role,
            scope: recurseScope,
            result: result
          });
        }
      }));
      return result;
    }
  }, {
    get: function(node) {
      return node.ngInjector;
    },
    find: function(node) {
      while (node) {
        var injector = $NodeInjector.get(node);
        if (injector) {
          return injector;
        }
        node = node.parentNode || node.host;
      }
      return null;
    }
  });
  NodeInjector.prototype.insertBefore.parameters = [[NodeInjector]];
  NodeInjector.prototype.insertAfter.parameters = [[NodeInjector]];
  NodeInjector.prototype.appendTo.parameters = [[NodeInjector]];
  NodeInjector.prototype.nodeMoved.parameters = [[$traceurRuntime.type.boolean]];
  var RootInjector = function RootInjector() {
    var $__7 = $traceurRuntime.assertObject(arguments[0] !== (void 0) ? arguments[0] : {}),
        node = $__7.node,
        providers = "providers" in $__7 ? $__7.providers : [];
    providers = [valueProvider($RootInjector, this)].concat(providers);
    $traceurRuntime.superCall(this, $RootInjector.prototype, "constructor", [{
      node: node,
      providers: providers,
      root: this
    }]);
    this._adjustQueryablesInParents(1);
  };
  var $RootInjector = RootInjector;
  ($traceurRuntime.createClass)(RootInjector, {}, {}, NodeInjector);
  return {
    get NodeInjector() {
      return NodeInjector;
    },
    get RootInjector() {
      return RootInjector;
    },
    __esModule: true
  };
});
