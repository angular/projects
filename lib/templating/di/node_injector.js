define(["rtts-assert", 'di', '../util/annotation_provider', '../annotations'], function($__0,$__1,$__2,$__3) {
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
  var $__6 = $traceurRuntime.assertObject($__1),
      Injector = $__6.Injector,
      Provide = $__6.Provide,
      TransientScope = $__6.TransientScope,
      Inject = $__6.Inject;
  var AnnotationProvider = $traceurRuntime.assertObject($__2).AnnotationProvider;
  var $__6 = $traceurRuntime.assertObject($__3),
      Queryable = $__6.Queryable,
      QueryListener = $__6.QueryListener,
      QueryScope = $__6.QueryScope,
      ImplicitScope = $__6.ImplicitScope;
  var nextId = 0;
  var NodeInjector = function NodeInjector() {
    var $__6 = $traceurRuntime.assertObject(arguments[0] !== (void 0) ? arguments[0] : {}),
        node = $__6.node,
        providers = "providers" in $__6 ? $__6.providers : [],
        root = "root" in $__6 ? $__6.root : null,
        isShadowRoot = "isShadowRoot" in $__6 ? $__6.isShadowRoot : false,
        parent = "parent" in $__6 ? $__6.parent : null;
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
    createChild: function($__6) {
      var node = $__6.node,
          providers = $__6.providers,
          isShadowRoot = "isShadowRoot" in $__6 ? $__6.isShadowRoot : false;
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
      var annotationProvider = this._root.get(AnnotationProvider);
      this._delegate._providers.forEach((function(provider, token) {
        searchAndAddAnnotations(provider.provider, token);
        provider.params.forEach((function(param) {
          if (typeof param.token === 'function' && annotationProvider(param.token, ImplicitScope)) {
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
      function addQueryListener($__7, callback) {
        var role = $__7.role,
            ordered = $__7.ordered,
            priority = "priority" in $__7 ? $__7.priority : 0;
        var query = self._queries[role] = {
          role: role,
          priority: priority,
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
      var $__4 = this;
      if (!roles) {
        roles = this._subtreeQueryables;
      }
      var parent = this;
      var changedQueries = [];
      while (parent) {
        for (var role in this._subtreeQueryables) {
          if (inc) {
            var counter = parent._subtreeQueryables[role] || 0;
            parent._subtreeQueryables[role] = counter + inc;
          }
          var query = parent._queries[role];
          if (query) {
            changedQueries.push(query);
          }
        }
        parent = parent._parent;
      }
      changedQueries.sort((function(query1, query2) {
        return query2.priority - query1.priority;
      }));
      changedQueries.forEach((function(query) {
        if (query.ordered || inc !== 0) {
          query.changed($__4, inc);
        }
      }));
    },
    _findQueryables: function($__7) {
      var role = $__7.role,
          scope = "scope" in $__7 ? $__7.scope : QueryScope.DEEP,
          result = "result" in $__7 ? $__7.result : [];
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
    var $__8 = $traceurRuntime.assertObject(arguments[0] !== (void 0) ? arguments[0] : {}),
        node = $__8.node,
        providers = "providers" in $__8 ? $__8.providers : [];
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
  function valueProvider(token, value) {
    function provider() {
      return value;
    }
    provider.annotations = [new Provide(token)];
    return provider;
  }
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
