define(['./util'], function($__0) {
  "use strict";
  var __moduleName = "routerConfiguration";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var $__3 = $traceurRuntime.assertObject($__0),
      extend = $__3.extend,
      getWildcardPath = $__3.getWildcardPath;
  var RouterConfiguration = function RouterConfiguration() {
    this.instructions = [];
  };
  ($traceurRuntime.createClass)(RouterConfiguration, {
    map: function(pattern, config) {
      if (Array.isArray(pattern)) {
        for (var i = 0; i < pattern.length; i++) {
          this.map(pattern[i]);
        }
        return this;
      }
      if (typeof pattern == 'string') {
        if (!config) {
          config = {};
        } else if (typeof config == 'string') {
          config = {componentUrl: config};
        }
        config.pattern = pattern;
      } else {
        config = pattern;
      }
      return this.mapRoute(config);
    },
    mapRoute: function(config) {
      var $__1 = this;
      this.instructions.push((function(router) {
        if (Array.isArray(config.pattern)) {
          var navModel = {};
          for (var i = 0,
              length = config.pattern.length; i < length; i++) {
            var current = extend({}, config);
            current.pattern = config.pattern[i];
            $__1.configureRoute(router, current, navModel);
          }
        } else {
          $__1.configureRoute(router, extend({}, config));
        }
      }));
      return this;
    },
    mapUnknownRoutes: function(config) {
      this.unknownRouteConfig = config;
      return this;
    },
    exportToRouter: function(router) {
      var instructions = this.instructions;
      for (var i = 0,
          length = instructions.length; i < length; i++) {
        instructions[i](router);
      }
      if (this.title) {
        router.title = this.title;
      }
      if (this.unknownRouteConfig) {
        router.handleUnknownRoutes(this.unknownRouteConfig);
      }
    },
    configureRoute: function(router, config, navModel) {
      this.ensureDefaultsForRouteConfig(config);
      router.addRoute(config, navModel);
    },
    ensureDefaultsForRouteConfig: function(config) {
      config.name = ensureConfigValue(config, 'name', this.deriveName);
      config.pattern = ensureConfigValue(config, 'pattern', this.derivePattern);
      config.title = ensureConfigValue(config, 'title', this.deriveTitle);
      config.componentUrl = ensureConfigValue(config, 'componentUrl', this.deriveComponentUrl);
    },
    deriveName: function(config) {
      return config.title || (config.pattern ? stripParametersFromPattern(config.pattern) : config.componentUrl);
    },
    derivePattern: function(config) {
      return config.componentUrl || config.name;
    },
    deriveTitle: function(config) {
      var value = config.name;
      return value.substr(0, 1).toUpperCase() + value.substr(1);
    },
    deriveComponentUrl: function(config) {
      return stripParametersFromPattern(config.pattern);
    }
  }, {});
  function ensureConfigValue(config, property, getter) {
    var value = config[property];
    if (value || value == '') {
      return value;
    }
    return getter(config);
  }
  function stripParametersFromPattern(pattern) {
    var colonIndex = pattern.indexOf(':');
    var length = colonIndex > 0 ? colonIndex - 1 : pattern.length;
    return pattern.substr(0, length);
  }
  return {
    get RouterConfiguration() {
      return RouterConfiguration;
    },
    __esModule: true
  };
});
