define(['rtts-assert'], function($__0) {
  "use strict";
  var __moduleName = "types";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var ArrayOfString = function ArrayOfString() {
    assert.fail('type is not instantiable');
  };
  ($traceurRuntime.createClass)(ArrayOfString, {}, {assert: function(obj) {
      assert(obj).is(assert.arrayOf(assert.string));
    }});
  return {
    get ArrayOfString() {
      return ArrayOfString;
    },
    __esModule: true
  };
});
