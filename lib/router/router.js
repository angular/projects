define(['route-recognizer', './navigationContext', './navigationInstruction', './routerConfiguration', './util'], function($__0,$__1,$__2,$__3,$__4) {
  "use strict";
  var __moduleName = "router";
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
  var RouteRecognizer = $traceurRuntime.assertObject($__0).default;
  var NavigationContext = $traceurRuntime.assertObject($__1).NavigationContext;
  var NavigationInstruction = $traceurRuntime.assertObject($__2).NavigationInstruction;
  var RouterConfiguration = $traceurRuntime.assertObject($__3).RouterConfiguration;
  var $__6 = $traceurRuntime.assertObject($__4),
      processPotential = $__6.processPotential,
      combinePath = $__6.combinePath;
  RouteRecognizer = typeof RouteRecognizer === 'function' ? RouteRecognizer : RouteRecognizer['default'];
  var Router = function Router(history) {
    this.history = history;
    this.viewPorts = {};
    this.reset();
    this.baseUrl = '';
  };
  var $Router = Router;
  ($traceurRuntime.createClass)(Router, {
    registerViewPort: function(viewPort, name) {
      name = name || 'default';
      if (typeof this.viewPorts[name] == 'function') {
        var callback = this.viewPorts[name];
        this.viewPorts[name] = viewPort;
        callback(viewPort);
      } else {
        this.viewPorts[name] = viewPort;
      }
    },
    refreshBaseUrl: function() {
      if (this.parent) {
        var baseUrl = this.parent.currentInstruction.getBaseUrl();
        this.baseUrl = this.parent.baseUrl + baseUrl;
      }
    },
    refreshNavigation: function() {
      var nav = this.navigation;
      for (var i = 0,
          length = nav.length; i < length; i++) {
        var current = nav[i];
        if (this.baseUrl[0] == '/') {
          current.href = '#' + this.baseUrl;
        } else {
          current.href = '#/' + this.baseUrl;
        }
        if (current.href[current.href.length - 1] != '/') {
          current.href += '/';
        }
        current.href += current.relativeHref;
      }
    },
    configure: function(callbackOrConfig) {
      if (typeof callbackOrConfig == 'function') {
        var config = new RouterConfiguration();
        callbackOrConfig(config);
        config.exportToRouter(this);
      } else {
        callbackOrConfig.exportToRouter(this);
      }
      return this;
    },
    navigate: function(fragment, options) {
      fragment = combinePath(fragment, this.baseUrl);
      return this.history.navigate(fragment, options);
    },
    navigateBack: function() {
      this.history.navigateBack();
    },
    createChild: function() {
      var childRouter = new $Router(this.history);
      childRouter.parent = this;
      return childRouter;
    },
    createNavigationInstruction: function() {
      var url = arguments[0] !== (void 0) ? arguments[0] : '';
      var parentInstruction = arguments[1];
      var results = this.recognizer.recognize(url);
      if (!results || !results.length) {
        results = this.childRecognizer.recognize(url);
      }
      if (results && results.length) {
        var first = results[0],
            fragment = url,
            queryIndex = fragment.indexOf('?'),
            queryString;
        if (queryIndex != -1) {
          fragment = url.substr(0, queryIndex);
          queryString = url.substr(queryIndex + 1);
        }
        var instruction = new NavigationInstruction(fragment, queryString, first.params, first.queryParams, first.handler, parentInstruction);
        if (typeof first.handler == 'function') {
          instruction.config = {};
          return first.handler(instruction);
        }
        return Promise.resolve(instruction);
      } else {
        return Promise.reject(new Error(("Route Not Found: " + url)));
      }
    },
    createNavigationContext: function(instruction) {
      return new NavigationContext(this, instruction);
    },
    generate: function(name, params) {
      return this.recognizer.generate(name, params);
    },
    addRoute: function(config) {
      var navModel = arguments[1] !== (void 0) ? arguments[1] : {};
      if (!('viewPorts' in config)) {
        config.viewPorts = {'default': {componentUrl: config.componentUrl}};
      }
      navModel.title = navModel.title || config.title;
      this.routes.push(config);
      this.recognizer.add([{
        path: config.pattern,
        handler: config
      }]);
      if (config.pattern) {
        var withChild = JSON.parse(JSON.stringify(config));
        withChild.pattern += "/*childRoute";
        withChild.hasChildRouter = true;
        this.childRecognizer.add([{
          path: withChild.pattern,
          handler: withChild
        }]);
        withChild.navModel = navModel;
      }
      config.navModel = navModel;
      if (('nav' in config || 'order' in navModel) && this.navigation.indexOf(navModel) === -1) {
        navModel.order = navModel.order || config.nav;
        navModel.href = navModel.href || config.href;
        navModel.isActive = false;
        navModel.config = config;
        if (!config.href) {
          navModel.relativeHref = config.pattern;
          navModel.href = '';
        }
        if (typeof navModel.order != 'number') {
          navModel.order = ++this.fallbackOrder;
        }
        this.navigation.push(navModel);
        this.navigation = this.navigation.sort((function(a, b) {
          return a.order - b.order;
        }));
      }
    },
    handleUnknownRoutes: function(config) {
      var catchAllPattern = "*path";
      var callback = (function(instruction) {
        return new Promise((function(resolve, reject) {
          function done(inst) {
            inst = inst || instruction;
            inst.config.pattern = catchAllPattern;
            resolve(inst);
          }
          if (!config) {
            instruction.config.componentUrl = instruction.fragment;
            done(instruction);
          } else if (typeof config == 'string') {
            instruction.config.componentUrl = config;
            done(instruction);
          } else if (typeof config == 'function') {
            processPotential(config(instruction), done, reject);
          } else {
            instruction.config = config;
            done(instruction);
          }
        }));
      });
      this.childRecognizer.add([{
        path: catchAllPattern,
        handler: callback
      }]);
    },
    reset: function() {
      this.fallbackOrder = 100;
      this.recognizer = new RouteRecognizer();
      this.childRecognizer = new RouteRecognizer();
      this.routes = [];
      this.isNavigating = false;
      this.navigation = [];
    }
  }, {});
  return {
    get Router() {
      return Router;
    },
    __esModule: true
  };
});
