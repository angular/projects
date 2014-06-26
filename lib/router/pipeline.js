define([], function() {
  "use strict";
  var __moduleName = "pipeline";
  function createResult(ctx, next) {
    return {
      status: next.status,
      context: ctx,
      output: next.output,
      completed: next.status == COMPLETED
    };
  }
  var COMPLETED = 'completed';
  var CANCELLED = 'cancelled';
  var REJECTED = 'rejected';
  var RUNNING = 'running';
  var Pipeline = function Pipeline() {
    this.steps = [];
  };
  ($traceurRuntime.createClass)(Pipeline, {
    withStep: function(step) {
      var run;
      if (typeof step == 'function') {
        run = step;
      } else {
        run = step.run.bind(step);
      }
      this.steps.push(run);
      return this;
    },
    run: function(ctx) {
      var index = -1,
          steps = this.steps,
          next,
          currentStep;
      function next() {
        index++;
        if (index < steps.length) {
          currentStep = steps[index];
          try {
            return currentStep(ctx, next);
          } catch (e) {
            return next.reject(e);
          }
        } else {
          return next.complete();
        }
      }
      ;
      next.complete = (function(output) {
        next.status = COMPLETED;
        next.output = output;
        return Promise.resolve(createResult(ctx, next));
      });
      next.cancel = (function(reason) {
        next.status = CANCELLED;
        next.output = reason;
        return Promise.resolve(createResult(ctx, next));
      });
      next.reject = (function(error) {
        next.status = REJECTED;
        next.output = error;
        return Promise.reject(createResult(ctx, next));
      });
      next.status = RUNNING;
      return next();
    }
  }, {});
  return {
    get COMPLETED() {
      return COMPLETED;
    },
    get CANCELLED() {
      return CANCELLED;
    },
    get REJECTED() {
      return REJECTED;
    },
    get RUNNING() {
      return RUNNING;
    },
    get Pipeline() {
      return Pipeline;
    },
    __esModule: true
  };
});
