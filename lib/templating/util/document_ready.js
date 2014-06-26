define(['di', './global'], function($__0,$__1) {
  "use strict";
  var __moduleName = "document_ready";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var Inject = $traceurRuntime.assertObject($__0).Inject;
  var Global = $traceurRuntime.assertObject($__1).Global;
  function DocumentReady(global) {
    return new global.Promise(ready);
    function ready(resolve, reject) {
      if (global.document.readyState === "complete") {
        resolve(global.document);
      } else {
        global.document.addEventListener("DOMContentLoaded", completed, false);
        global.addEventListener("load", completed, false);
      }
      function completed() {
        global.document.removeEventListener("DOMContentLoaded", completed, false);
        global.removeEventListener("load", completed, false);
        resolve(global.document);
      }
    }
  }
  DocumentReady.annotations = [new Inject(Global)];
  return {
    get DocumentReady() {
      return DocumentReady;
    },
    __esModule: true
  };
});
