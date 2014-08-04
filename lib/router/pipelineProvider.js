define(["rtts-assert", 'di', './pipeline', './navigationPlan', './modelBinding', './componentLoading', './navigationContext', './activation'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7) {
  "use strict";
  var __moduleName = "pipelineProvider";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  if (!$__4 || !$__4.__esModule)
    $__4 = {'default': $__4};
  if (!$__5 || !$__5.__esModule)
    $__5 = {'default': $__5};
  if (!$__6 || !$__6.__esModule)
    $__6 = {'default': $__6};
  if (!$__7 || !$__7.__esModule)
    $__7 = {'default': $__7};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var Injector = $traceurRuntime.assertObject($__1).Injector;
  var Pipeline = $traceurRuntime.assertObject($__2).Pipeline;
  var BuildNavigationPlanStep = $traceurRuntime.assertObject($__3).BuildNavigationPlanStep;
  var ApplyModelBindersStep = $traceurRuntime.assertObject($__4).ApplyModelBindersStep;
  var LoadNewComponentsStep = $traceurRuntime.assertObject($__5).LoadNewComponentsStep;
  var CommitChangesStep = $traceurRuntime.assertObject($__6).CommitChangesStep;
  var $__10 = $traceurRuntime.assertObject($__7),
      CanDeactivatePreviousStep = $__10.CanDeactivatePreviousStep,
      CanActivateNextStep = $__10.CanActivateNextStep,
      DeactivatePreviousStep = $__10.DeactivatePreviousStep,
      ActivateNextStep = $__10.ActivateNextStep;
  var PipelineProvider = function PipelineProvider(injector) {
    assert.argumentTypes(injector, Injector);
    this.injector = injector;
    this.steps = [BuildNavigationPlanStep, CanDeactivatePreviousStep, LoadNewComponentsStep, ApplyModelBindersStep, CanActivateNextStep, DeactivatePreviousStep, ActivateNextStep, CommitChangesStep];
  };
  ($traceurRuntime.createClass)(PipelineProvider, {createPipeline: function(navigationContext) {
      var $__8 = this;
      var pipeline = new Pipeline();
      this.steps.forEach((function(step) {
        return pipeline.withStep($__8.injector.get(step));
      }));
      return pipeline;
    }}, {});
  PipelineProvider.parameters = [[Injector]];
  return {
    get PipelineProvider() {
      return PipelineProvider;
    },
    __esModule: true
  };
});
