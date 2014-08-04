define(["rtts-assert", './di/node_injector', './types', 'di', './annotations'], function($__0,$__1,$__2,$__3,$__4) {
  "use strict";
  var __moduleName = "view";
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
  var assert = $traceurRuntime.assertObject($__0).assert;
  var NodeInjector = $traceurRuntime.assertObject($__1).NodeInjector;
  var ArrayLikeOfNodes = $traceurRuntime.assertObject($__2).ArrayLikeOfNodes;
  var Inject = $traceurRuntime.assertObject($__3).Inject;
  var $__7 = $traceurRuntime.assertObject($__4),
      QueryScope = $__7.QueryScope,
      QueryListener = $__7.QueryListener;
  var FLUSH_REMOVE = 'remove';
  var FLUSH_MOVE = 'move';
  var View = function View(nodes, injector, viewPort) {
    assert.argumentTypes(nodes, ArrayLikeOfNodes, injector, NodeInjector, viewPort, ViewPort);
    $traceurRuntime.superCall(this, $View.prototype, "constructor", []);
    this._viewPort = viewPort;
    this.injector = injector;
    this._nodes = Array.prototype.slice.call(nodes);
    if (nodes[0].parentNode && nodes === nodes[0].parentNode.childNodes && nodes[0].parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      this._fragment = nodes[0].parentNode;
      this._nodesRemoved = true;
    } else {
      this._fragment = document.createDocumentFragment();
      this._nodesRemoved = false;
    }
    this._flushAction = null;
  };
  var $View = View;
  ($traceurRuntime.createClass)(View, {
    remove: function() {
      this.injector.remove();
      this._flushAction = FLUSH_REMOVE;
      this._viewPort._viewRemoved(this);
    },
    insertBeforeView: function(refView) {
      assert.argumentTypes(refView, $View);
      this.injector.insertBefore(refView.injector);
      this._flushAction = FLUSH_MOVE;
      this._viewPort._viewMoved(this);
    },
    insertAfterView: function(refView) {
      assert.argumentTypes(refView, $View);
      this.injector.insertAfter(refView.injector);
      this._flushAction = FLUSH_MOVE;
      this._viewPort._viewMoved(this);
    },
    appendTo: function(viewPort) {
      assert.argumentTypes(viewPort, ViewPort);
      this.injector.appendTo(this._viewPort._anchorInjector);
      this._flushAction = FLUSH_MOVE;
      this._viewPort._viewMoved(this);
    },
    _removeNodesIfNeeded: function() {
      var $__5 = this;
      if (!this._nodesRemoved) {
        this._nodesRemoved = true;
        this._nodes.forEach((function(node) {
          $__5._fragment.appendChild(node);
        }));
      }
    },
    _insertAfterNode: function(refNode) {
      assert.argumentTypes(refNode, Node);
      this._removeNodesIfNeeded();
      var nextNode = refNode.nextSibling;
      if (!nextNode) {
        refNode.parentNode.appendChild(this._fragment);
      } else {
        refNode.parentNode.insertBefore(this._fragment, nextNode);
      }
      this._nodesRemoved = false;
    },
    _flushMoved: function(prevView) {
      assert.argumentTypes(prevView, $View);
      if (this._flushAction !== FLUSH_MOVE) {
        return false;
      }
      this._flushAction = null;
      if (prevView) {
        this._insertAfterNode(prevView._nodes[prevView._nodes.length - 1]);
      } else {
        this._insertAfterNode(this._viewPort._anchorNode);
      }
      return true;
    },
    _flushRemoved: function() {
      if (this._flushAction !== FLUSH_REMOVE) {
        return false;
      }
      this._flushAction = null;
      this._removeNodesIfNeeded();
      return true;
    }
  }, {});
  View.parameters = [[ArrayLikeOfNodes], [NodeInjector], [ViewPort]];
  View.prototype.insertBeforeView.parameters = [[View]];
  View.prototype.insertAfterView.parameters = [[View]];
  View.prototype.appendTo.parameters = [[ViewPort]];
  View.prototype._insertAfterNode.parameters = [[Node]];
  View.prototype._flushMoved.parameters = [[View]];
  var FLUSH_MANY_VIEWS_CHANGED = 10;
  var ViewPort = function ViewPort(anchorNode, anchorInjector) {
    assert.argumentTypes(anchorNode, HTMLElement, anchorInjector, $traceurRuntime.type.any);
    this._anchorNode = anchorNode;
    this._anchorInjector = anchorInjector;
    this._requiresFlush = false;
    this._removedViewCandidates = [];
    this._movedViewCandidates = [];
  };
  ($traceurRuntime.createClass)(ViewPort, {
    _viewMoved: function(view) {
      assert.argumentTypes(view, View);
      this._requiresFlush = true;
      if (this._movedViewCandidates.length < FLUSH_MANY_VIEWS_CHANGED) {
        this._movedViewCandidates.push(view);
      }
    },
    _viewRemoved: function(view) {
      assert.argumentTypes(view, View);
      this._requiresFlush = true;
      this._removedViewCandidates.push(view);
    },
    flush: function() {
      if (!this._requiresFlush) {
        return;
      }
      var siblingInjectors = this._anchorInjector._children;
      if (this._movedViewCandidates.length < FLUSH_MANY_VIEWS_CHANGED) {
        this._movedViewCandidates.forEach((function(childView) {
          var index = siblingInjectors.indexOf(childView.injector);
          var previousInjector = siblingInjectors[index - 1];
          var prevView = previousInjector ? previousInjector.get(View) : null;
          childView._flushMoved(prevView);
        }));
      } else {
        var prevView = null;
        siblingInjectors.forEach((function(childInjector) {
          var childView = childInjector.get(View);
          childView._flushMoved(prevView);
          prevView = childView;
        }));
      }
      this._removedViewCandidates.forEach((function(view) {
        view._flushRemoved();
      }));
      this._requiresFlush = false;
      this._movedViewCandidates = [];
      this._removedViewCandidates = [];
    }
  }, {});
  ViewPort.parameters = [[HTMLElement], []];
  ViewPort.prototype._viewMoved.parameters = [[View]];
  ViewPort.prototype._viewRemoved.parameters = [[View]];
  function DomMovedAwareListener(rootInjector) {
    return {
      queryChanged: queryChanged,
      invoke: invoke
    };
    function queryChanged(sourceInjector, addRemove) {
      var domMovedListeners = sourceInjector._findQueryables({
        scope: QueryScope.DEEP,
        role: 'domMovedAware'
      });
      domMovedListeners.forEach((function(entry) {
        entry.instances.forEach((function(instance) {
          instance.__domMoved = addRemove === 1 || addRemove === 0;
        }));
      }));
    }
    function invoke() {
      var domMovedListeners = rootInjector._findQueryables({
        scope: QueryScope.DEEP,
        role: 'domMovedAware'
      });
      var needsDigest = false;
      domMovedListeners.forEach((function(entry) {
        entry.instances.forEach((function(instance) {
          if (instance.__domMoved) {
            needsDigest = needsDigest || instance.domMoved();
          }
          instance.__domMoved = false;
        }));
      }));
      return needsDigest;
    }
  }
  DomMovedAwareListener.annotations = [new QueryListener({
    role: 'domMovedAware',
    ordered: true
  }), new Inject(NodeInjector)];
  function FlushViews(rootInjector, domMovedListener) {
    var scheduled = false;
    return {
      queryChanged: scheduleFlush,
      invoke: invoke
    };
    function scheduleFlush(sourceInjector, addRemove) {
      if (!scheduled) {
        scheduled = true;
      }
    }
    function invoke() {
      if (!scheduled) {
        return;
      }
      scheduled = false;
      var viewPorts = rootInjector._findQueryables({
        scope: QueryScope.DEEP,
        role: 'viewPort'
      });
      var i = viewPorts.length;
      while (i--) {
        viewPorts[i].instances.forEach((function(viewPort) {
          return viewPort.flush();
        }));
      }
      return domMovedListener.invoke();
    }
  }
  FlushViews.annotations = [new QueryListener({
    role: 'view',
    ordered: true
  }), new Inject(NodeInjector, DomMovedAwareListener)];
  return {
    get View() {
      return View;
    },
    get FLUSH_MANY_VIEWS_CHANGED() {
      return FLUSH_MANY_VIEWS_CHANGED;
    },
    get ViewPort() {
      return ViewPort;
    },
    get DomMovedAwareListener() {
      return DomMovedAwareListener;
    },
    get FlushViews() {
      return FlushViews;
    },
    __esModule: true
  };
});
