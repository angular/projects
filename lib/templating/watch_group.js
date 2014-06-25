define(['expressionist', 'expressionist', 'watchtower', 'watchtower', 'di', './di/node_injector', './annotations'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6) {
  "use strict";
  var __moduleName = "watch_group";
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
  var $__9 = $traceurRuntime.assertObject($__0),
      WatchParser = $__9.WatchParser,
      Parser = $__9.Parser;
  var Parser = $traceurRuntime.assertObject($__1).Parser;
  var GetterCache = $traceurRuntime.assertObject($__2).GetterCache;
  var $__9 = $traceurRuntime.assertObject($__3),
      WtRootWatchGroup = $__9.RootWatchGroup,
      PureFunctionAST = $__9.PureFunctionAST;
  var $__9 = $traceurRuntime.assertObject($__4),
      Inject = $__9.Inject,
      Provide = $__9.Provide,
      Injector = $__9.Injector,
      InjectParent = $__9.InjectParent;
  var NodeInjector = $traceurRuntime.assertObject($__5).NodeInjector;
  var SystemAttachAware = $traceurRuntime.assertObject($__6).SystemAttachAware;
  var WatchGroup = function WatchGroup() {
    this._cachedWatches = [];
  };
  ($traceurRuntime.createClass)(WatchGroup, {
    watch: function($__9) {
      var expression = $__9.expression,
          callback = $__9.callback,
          context = $__9.context,
          collection = "collection" in $__9 ? $__9.collection : false;
      var filters = null;
      var watchAst = this._parser.parse(expression, filters, collection, context);
      this._cachedWatches.push({
        watchAst: watchAst,
        callback: callback
      });
      if (this._watchGrp) {
        this._watchGrp.watchExpression(watchAst, callback);
      }
    },
    _afterAttached: function() {
      var $__7 = this;
      this._cachedWatches.forEach((function($__10) {
        var watchAst = $__10.watchAst,
            callback = $__10.callback;
        $__7._watchGrp.watchExpression(watchAst, callback);
      }));
    }
  }, {});
  var ChildWatchGroup = function ChildWatchGroup(parser, rootWatchGroup) {
    $traceurRuntime.superCall(this, $ChildWatchGroup.prototype, "constructor", []);
    this._parser = parser;
    this._root = rootWatchGroup;
  };
  var $ChildWatchGroup = ChildWatchGroup;
  ($traceurRuntime.createClass)(ChildWatchGroup, {
    diAttached: function(parentWatchGroup) {
      this._watchGrp = this._root._watchGrp.newGroup();
      parentWatchGroup._watchGrp.addGroup(this._watchGrp);
      this._afterAttached();
    },
    diDetached: function() {
      this._watchGrp.remove();
      this._watchGrp = null;
    }
  }, {}, WatchGroup);
  ChildWatchGroup.prototype.diAttached.parameters = [[new InjectParent(WatchGroup)]];
  function childWatchGroupProviders() {
    function childWatchGroupProvider(childWatchGroup) {
      return childWatchGroup;
    }
    childWatchGroupProvider.annotations = [new Inject(ChildWatchGroup), new Provide(WatchGroup)];
    return [childWatchGroupProvider, ChildWatchGroup];
  }
  var NoneObserver = function NoneObserver() {};
  ($traceurRuntime.createClass)(NoneObserver, {
    open: function(callback) {},
    close: function() {}
  }, {});
  var NodeObserver = function NodeObserver(node, property, events) {
    var $__7 = this;
    this.node = node;
    this.property = property;
    this.events = events;
    this.listener = (function() {
      $__7.callback($__7._nodeValue());
    });
  };
  ($traceurRuntime.createClass)(NodeObserver, {
    _nodeValue: function() {
      var val = this.node[this.property];
      return val ? val : null;
    },
    open: function(callback) {
      var $__7 = this;
      this.callback = callback;
      this.events.forEach((function(event) {
        $__7.node.addEventListener(event, $__7.listener, false);
      }));
      this.node.addEventListener('propchange', this.listener, false);
      return this._nodeValue();
    },
    close: function() {
      var $__7 = this;
      this.callback = null;
      this.events.forEach((function(event) {
        $__7.node.removeEventListener(event, $__7.listener);
      }));
      this.node.removeEventListener('propchange', this.listener, false);
    }
  }, {});
  var ObserverSelector = function ObserverSelector() {};
  ($traceurRuntime.createClass)(ObserverSelector, {getObserver: function(obj, field) {
      var isNode = obj && !!obj.nodeName;
      if (!isNode) {
        return null;
      }
      var injector = NodeInjector.find(obj);
      var changeEventConfig = injector.get(ChangeEventConfig);
      var events = [];
      changeEventConfig.forEach((function(config) {
        if (config.nodeName === obj.nodeName.toLowerCase()) {
          config.properties.forEach((function(property) {
            var $__11;
            if (property === field || (property === 'NATIVE' && isNodeDomApi(obj, field))) {
              ($__11 = events).push.apply($__11, $traceurRuntime.toObject(config.events));
            }
          }));
        }
      }));
      if (events.length) {
        return new NodeObserver(obj, field, events);
      } else {
        if (isNodeDomApi(obj, field)) {
          return new NoneObserver();
        } else {
          return null;
        }
      }
    }}, {});
  var RootWatchGroup = function RootWatchGroup(parser, observerSelector) {
    $traceurRuntime.superCall(this, $RootWatchGroup.prototype, "constructor", []);
    this._parser = parser;
    this._observerSelector = observerSelector;
    this._root = this;
    this._watchGrp = new WtRootWatchGroup(new GetterCache({}), observerSelector, {});
  };
  var $RootWatchGroup = RootWatchGroup;
  ($traceurRuntime.createClass)(RootWatchGroup, {
    digestOnce: function() {
      return this._watchGrp.detectChanges(null);
    },
    diAttached: function() {
      this._afterAttached();
    }
  }, {}, WatchGroup);
  RootWatchGroup.annotations = [new SystemAttachAware, new Inject(WatchParser, ObserverSelector)];
  function rootWatchGroupProviders() {
    function rootWatchGroupProvider(rootWatchGroup) {
      return rootWatchGroup;
    }
    rootWatchGroupProvider.annotations = [new Inject(RootWatchGroup), new Provide(WatchGroup)];
    return [RootWatchGroup, rootWatchGroupProvider];
  }
  ChildWatchGroup.annotations = [new Inject(WatchParser, RootWatchGroup), new SystemAttachAware()];
  function ChangeEventConfig() {
    return [{
      nodeName: 'input',
      events: ['input', 'change'],
      properties: ['NATIVE']
    }, {
      nodeName: 'textarea',
      events: ['input', 'change'],
      properties: ['NATIVE']
    }, {
      nodeName: 'select',
      events: ['change'],
      properties: ['NATIVE']
    }];
  }
  function isNodeDomApi(node, property) {
    if (!node || !node.nodeName) {
      return false;
    }
    var nodeName = node.nodeName.toLowerCase();
    var customElementRE = /.*-.*/;
    if (nodeName.match(customElementRE)) {
      nodeName = 'div';
    }
    var cache = isNodeDomApi.cache;
    if (!cache) {
      cache = isNodeDomApi.cache = {};
    }
    if (!cache[nodeName]) {
      var protoEl;
      if (nodeName === '#text') {
        protoEl = document.createTextNode('');
      } else {
        protoEl = document.createElement(nodeName);
      }
      var propNames = Object.getOwnPropertyNames(protoEl);
      var nodeCache = {};
      propNames.forEach((function(propName) {
        nodeCache[propName] = true;
      }));
      cache[node.nodeName] = nodeCache;
    }
    return !!cache[node.nodeName][property];
  }
  return {
    get WatchGroup() {
      return WatchGroup;
    },
    get ChildWatchGroup() {
      return ChildWatchGroup;
    },
    get childWatchGroupProviders() {
      return childWatchGroupProviders;
    },
    get NoneObserver() {
      return NoneObserver;
    },
    get NodeObserver() {
      return NodeObserver;
    },
    get ObserverSelector() {
      return ObserverSelector;
    },
    get RootWatchGroup() {
      return RootWatchGroup;
    },
    get rootWatchGroupProviders() {
      return rootWatchGroupProviders;
    },
    get ChangeEventConfig() {
      return ChangeEventConfig;
    },
    get isNodeDomApi() {
      return isNodeDomApi;
    },
    __esModule: true
  };
});
