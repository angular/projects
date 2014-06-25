define(['di'], function($__0) {
  "use strict";
  var __moduleName = "selector_config";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var Inject = $traceurRuntime.assertObject($__0).Inject;
  function SelectorConfig() {
    return {
      interpolationRegex: /{{(.*?)}}/g,
      bindAttrRegex: /bind-(.+)/,
      eventAttrRegex: /on-(.+)/
    };
  }
  return {
    get SelectorConfig() {
      return SelectorConfig;
    },
    __esModule: true
  };
});
