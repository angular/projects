define(['di', './watch_group', './task_queue', './view'], function($__0,$__1,$__2,$__3) {
  "use strict";
  var __moduleName = "digest";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var Inject = $traceurRuntime.assertObject($__0).Inject;
  var WatchGroup = $traceurRuntime.assertObject($__1).WatchGroup;
  var AsyncTaskQueue = $traceurRuntime.assertObject($__2).AsyncTaskQueue;
  var FlushViews = $traceurRuntime.assertObject($__3).FlushViews;
  function Digest(watchGroupRoot, taskQueue, flushViews) {
    return function digest() {
      do {
        execDigest();
      } while (flushViews.invoke());
    };
    function execDigest() {
      var ttl = 15,
          watchCount = -1;
      do {
        while (taskQueue.tasks.length) {
          taskQueue.tasks.shift()();
        }
        if (ttl == 0) {
          throw new Error('Model did not stabilize.');
        }
        ttl--;
        watchCount = watchGroupRoot.digestOnce();
      } while (watchCount || taskQueue.tasks.length);
    }
  }
  Digest.annotations = [new Inject(WatchGroup, AsyncTaskQueue, FlushViews)];
  return {
    get Digest() {
      return Digest;
    },
    __esModule: true
  };
});
