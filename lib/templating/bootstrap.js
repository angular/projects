define(['di', './watch_group', './di/node_injector', './ng_element', './component_loader', './util/document_ready', './view_factory', './di/injector_queries', './digest', './util/misc'], function($__0,$__1,$__2,$__3,$__4,$__5,$__6,$__7,$__8,$__9) {
  "use strict";
  var __moduleName = "bootstrap";
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
  if (!$__8 || !$__8.__esModule)
    $__8 = {'default': $__8};
  if (!$__9 || !$__9.__esModule)
    $__9 = {'default': $__9};
  var $__12 = $traceurRuntime.assertObject($__0),
      Inject = $__12.Inject,
      TransientScope = $__12.TransientScope,
      Provide = $__12.Provide;
  var rootWatchGroupProviders = $traceurRuntime.assertObject($__1).rootWatchGroupProviders;
  var $__12 = $traceurRuntime.assertObject($__2),
      RootInjector = $__12.RootInjector,
      NodeInjector = $__12.NodeInjector;
  var registerNgElement = $traceurRuntime.assertObject($__3).registerNgElement;
  var ComponentLoader = $traceurRuntime.assertObject($__4).ComponentLoader;
  var DocumentReady = $traceurRuntime.assertObject($__5).DocumentReady;
  var ViewFactory = $traceurRuntime.assertObject($__6).ViewFactory;
  var AttachAwareListener = $traceurRuntime.assertObject($__7).AttachAwareListener;
  var Digest = $traceurRuntime.assertObject($__8).Digest;
  var valueProvider = $traceurRuntime.assertObject($__9).valueProvider;
  var NgZone = function NgZone() {
    var $__10 = this;
    this.afterTasks = [];
    this.ngZone = window.zone.fork({
      afterTask: (function() {
        $__10.afterTasks.forEach((function(afterTask) {
          afterTask();
        }));
      }),
      onError: (function(err) {
        console.log(err.stack);
      })
    });
  };
  ($traceurRuntime.createClass)(NgZone, {
    run: function(callback) {
      return this.ngZone.run(callback);
    },
    afterTask: function(callback) {
      this.afterTasks.push(callback);
    }
  }, {});
  function bootstrap() {
    var ngZone = new NgZone();
    return ngZone.run((function() {
      var providers = $traceurRuntime.spread(rootWatchGroupProviders(), [valueProvider(NgZone, ngZone), AttachAwareListener]);
      var rootInjector = new RootInjector({
        providers: providers,
        node: document
      });
      ngZone.afterTask(rootInjector.get(Digest));
      rootInjector.get(startNgApp);
      rootInjector.get(registerNgElement);
      return rootInjector;
    }));
  }
  function startNgApp(componentLoader, documentReady, ngZone, viewFactory, nodeInjector) {
    var rootEl = document.documentElement;
    documentReady.then((function(doc) {
      ngZone.run((function() {
        if (rootEl.hasAttribute('ng-config')) {
          componentLoader.loadFromElement(rootEl, (function($__12) {
            var directive = $__12.directive;
            var componentInjector = viewFactory._createComponent({
              element: rootEl,
              component: directive,
              parentNodeInjector: nodeInjector
            });
            componentInjector.appendTo(nodeInjector);
          }));
        }
      }));
    }));
  }
  startNgApp.annotations = [new Inject(ComponentLoader, DocumentReady, NgZone, ViewFactory, NodeInjector), new TransientScope];
  return {
    get NgZone() {
      return NgZone;
    },
    get bootstrap() {
      return bootstrap;
    },
    get startNgApp() {
      return startNgApp;
    },
    __esModule: true
  };
});
