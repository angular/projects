define(['di', './pipeline', './navigationPlan', './modelBinding', './componentLoading', './navigationContext', './activation'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6) {
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
  var $__9 = $traceurRuntime.assertObject($__0),
      Inject = $__9.Inject,
      Injector = $__9.Injector;
  var Pipeline = $traceurRuntime.assertObject($__1).Pipeline;
  var BuildNavigationPlanStep = $traceurRuntime.assertObject($__2).BuildNavigationPlanStep;
  var ApplyModelBindersStep = $traceurRuntime.assertObject($__3).ApplyModelBindersStep;
  var LoadNewComponentsStep = $traceurRuntime.assertObject($__4).LoadNewComponentsStep;
  var CommitChangesStep = $traceurRuntime.assertObject($__5).CommitChangesStep;
  var $__9 = $traceurRuntime.assertObject($__6),
      CanDeactivatePreviousStep = $__9.CanDeactivatePreviousStep,
      CanActivateNextStep = $__9.CanActivateNextStep,
      DeactivatePreviousStep = $__9.DeactivatePreviousStep,
      ActivateNextStep = $__9.ActivateNextStep;
  var PipelineProvider = function PipelineProvider(injector) {
    this.injector = injector;
    this.steps = [BuildNavigationPlanStep, CanDeactivatePreviousStep, LoadNewComponentsStep, ApplyModelBindersStep, CanActivateNextStep, DeactivatePreviousStep, ActivateNextStep, CommitChangesStep];
  };
  ($traceurRuntime.createClass)(PipelineProvider, {createPipeline: function() {
      var $__7 = this;
      var pipeline = new Pipeline();
      this.steps.forEach((function(step) {
        return pipeline.withStep($__7.injector.get(step));
      }));
      return pipeline;
    }}, {});
  PipelineProvider.annotations = [new Inject(Injector)];
  return {
    get PipelineProvider() {
      return PipelineProvider;
    },
    __esModule: true
  };
});
