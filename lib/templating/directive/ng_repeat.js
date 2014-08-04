define(['../annotations', 'di', '../view_factory', '../view'], function($__0,$__1,$__2,$__3) {
  "use strict";
  var __moduleName = "ng_repeat";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  if (!$__3 || !$__3.__esModule)
    $__3 = {'default': $__3};
  var TemplateDirective = $traceurRuntime.assertObject($__0).TemplateDirective;
  var Inject = $traceurRuntime.assertObject($__1).Inject;
  var $__5 = $traceurRuntime.assertObject($__2),
      BoundViewFactory = $__5.BoundViewFactory,
      InitAttrs = $__5.InitAttrs;
  var ViewPort = $traceurRuntime.assertObject($__3).ViewPort;
  var NgRepeat = function NgRepeat(viewFactory, viewPort, parentExecutionContext) {
    this.viewFactory = viewFactory;
    this.parentExecutionContext = parentExecutionContext;
    this.viewPort = viewPort;
    this.views = [];
    this.ngRepeat = null;
  };
  ($traceurRuntime.createClass)(NgRepeat, {ngRepeatChanged: function(changeRecord) {
      var self = this;
      if (changeRecord && changeRecord.additionsHead && !changeRecord.movesHead && !changeRecord.removalsHead) {
        var entry = changeRecord.additionsHead;
        while (entry) {
          addRow(entry.item);
          entry = entry.nextAddedRec;
        }
        return;
      }
      var rows;
      if (changeRecord) {
        rows = changeRecord.iterable;
      } else {
        rows = [];
      }
      this.views.forEach((function(view) {
        view.remove();
      }));
      this.views = [];
      rows.forEach(addRow);
      function addRow(row) {
        var context = Object.create(self.parentExecutionContext);
        context.row = row;
        var view = self.viewFactory.createView({executionContext: context});
        var lastView = self.views[self.views.length - 1];
        if (lastView) {
          view.insertAfterView(lastView);
        } else {
          view.appendTo(self.viewPort);
        }
        self.views.push(view);
      }
    }}, {});
  NgRepeat.annotations = [new TemplateDirective({
    selector: '[ng-repeat]',
    bind: {'ngRepeat': 'ngRepeat'},
    observe: {'ngRepeat[]': 'ngRepeatChanged'}
  }), new Inject(BoundViewFactory, ViewPort, 'executionContext')];
  return {
    get NgRepeat() {
      return NgRepeat;
    },
    __esModule: true
  };
});
