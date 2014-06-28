define(['di', './watch_group', './task_queue'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "digest";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var Inject = $traceurRuntime.assertObject($__0).Inject;
  var WatchGroup = $traceurRuntime.assertObject($__1).WatchGroup;
  var AsyncTaskQueue = $traceurRuntime.assertObject($__2).AsyncTaskQueue;
  function Digest(watchGroupRoot, taskQueue) {
    return function digest() {
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
    };
  }
  Digest.annotations = [new Inject(WatchGroup, AsyncTaskQueue)];
  return {
    get Digest() {
      return Digest;
    },
    __esModule: true
  };
});
