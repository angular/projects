define(['di'], function($__0) {
  "use strict";
  var __moduleName = "task_queue";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var Provide = $traceurRuntime.assertObject($__0).Provide;
  function AsyncTaskQueue() {
    schedule.tasks = [];
    return schedule;
    function schedule(task) {
      schedule.tasks.push(task);
    }
  }
  function CustomElementAsyncTaskQueue() {
    var iterations = 0;
    var callbacks = [];
    var twiddle = document.createTextNode('');
    new (window.MutationObserver || JsMutationObserver)(atEndOfMicrotask).observe(twiddle, {characterData: true});
    return endOfMicrotask;
    function endOfMicrotask(callback) {
      twiddle.textContent = iterations++;
      callbacks.push(callback);
    }
    function atEndOfMicrotask() {
      while (callbacks.length) {
        callbacks.shift()();
      }
    }
  }
  CustomElementAsyncTaskQueue.annotations = [new Provide(AsyncTaskQueue)];
  return {
    get AsyncTaskQueue() {
      return AsyncTaskQueue;
    },
    get CustomElementAsyncTaskQueue() {
      return CustomElementAsyncTaskQueue;
    },
    __esModule: true
  };
});
