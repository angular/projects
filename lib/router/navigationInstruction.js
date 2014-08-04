define([], function() {
  "use strict";
  var __moduleName = "navigationInstruction";
  var NavigationInstruction = function NavigationInstruction(fragment, queryString, params, queryParams, config, parentInstruction) {
    this.fragment = fragment;
    this.queryString = queryString;
    this.params = params || {};
    this.queryParams = queryParams;
    this.config = config;
    this.lifecycleArgs = [params, queryParams, config];
    this.viewPortInstructions = {};
    if (parentInstruction) {
      this.params.$parent = parentInstruction.params;
    }
  };
  ($traceurRuntime.createClass)(NavigationInstruction, {
    addViewPortInstruction: function(viewPortName, strategy, componentUrl, component) {
      return this.viewPortInstructions[viewPortName] = {
        name: viewPortName,
        strategy: strategy,
        componentUrl: componentUrl,
        component: component,
        childRouter: component.executionContext.router,
        lifecycleArgs: this.lifecycleArgs.slice()
      };
    },
    getWildCardName: function() {
      var wildcardIndex = this.config.pattern.lastIndexOf('*');
      return this.config.pattern.substr(wildcardIndex + 1);
    },
    getWildcardPath: function() {
      var wildcardName = this.getWildCardName(),
          path = this.params[wildcardName];
      if (this.queryString) {
        path += "?" + this.queryString;
      }
      return path;
    },
    getBaseUrl: function() {
      if (!this.params) {
        return this.fragment;
      }
      var wildcardName = this.getWildCardName(),
          path = this.params[wildcardName];
      if (!path) {
        return this.fragment;
      }
      return this.fragment.substr(0, this.fragment.lastIndexOf(path));
    }
  }, {});
  return {
    get NavigationInstruction() {
      return NavigationInstruction;
    },
    __esModule: true
  };
});
