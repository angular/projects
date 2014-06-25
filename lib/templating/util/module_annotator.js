define([], function() {
  "use strict";
  var __moduleName = "module_annotator";
  function installModuleAnnotator(requirejs) {
    requirejs.s.contexts._.execCb = function(name, callback, args, exports) {
      var module = callback.apply(exports, args);
      for (var prop in module) {
        setModuleIdInAnnotations(module[prop], name);
      }
      return module;
    };
  }
  function setModuleIdInAnnotations(object, moduleId) {
    if (object && object.annotations) {
      object.annotations.forEach((function(annotation) {
        if ('moduleId' in annotation) {
          annotation.moduleId = moduleId;
        }
      }));
    }
  }
  return {
    get installModuleAnnotator() {
      return installModuleAnnotator;
    },
    __esModule: true
  };
});
