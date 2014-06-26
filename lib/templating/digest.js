define(['di', './watch_group'], function($__0,$__1) {
  "use strict";
  var __moduleName = "digest";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  var Inject = $traceurRuntime.assertObject($__0).Inject;
  var WatchGroup = $traceurRuntime.assertObject($__1).WatchGroup;
  function Digest(watchGroupRoot) {
    return function digest() {
      var ttl = 15,
          watchCount = -1;
      do {
        if (ttl == 0) {
          throw new Error('Model did not stabilize.');
        }
        ttl--;
        watchCount = watchGroupRoot.digestOnce();
      } while (watchCount);
    };
  }
  Digest.annotations = [new Inject(WatchGroup)];
  return {
    get Digest() {
      return Digest;
    },
    __esModule: true
  };
});
