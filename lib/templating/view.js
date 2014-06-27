define(["rtts-assert", './di/node_injector', './types'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "view";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var NodeInjector = $traceurRuntime.assertObject($__1).NodeInjector;
  var ArrayLikeOfNodes = $traceurRuntime.assertObject($__2).ArrayLikeOfNodes;
  var View = function View(nodes, injector) {
    assert.argumentTypes(nodes, ArrayLikeOfNodes, injector, NodeInjector);
    $traceurRuntime.superCall(this, $View.prototype, "constructor", []);
    this._injector = injector;
    this._nodes = Array.prototype.slice.call(nodes);
    if (nodes[0].parentNode && nodes === nodes[0].parentNode.childNodes && nodes[0].parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      this._fragment = nodes[0].parentNode;
      this._removed = true;
    } else {
      this._fragment = document.createDocumentFragment();
      this._removed = false;
    }
  };
  var $View = View;
  ($traceurRuntime.createClass)(View, {
    remove: function() {
      this._removeIfNeeded();
      this._injector.remove();
    },
    insertBeforeView: function(refView) {
      assert.argumentTypes(refView, $View);
      this._injector.insertBefore(refView._injector);
      this._insertBeforeNode(refView._nodes[0]);
    },
    insertAfterView: function(refView) {
      assert.argumentTypes(refView, $View);
      this._injector.insertAfter(refView._injector);
      this._insertAfterNode(refView._nodes[refView._nodes.length - 1]);
    },
    _removeIfNeeded: function() {
      var $__3 = this;
      if (!this._removed) {
        this._removed = true;
        this._nodes.forEach((function(node) {
          $__3._fragment.appendChild(node);
        }));
      }
    },
    _insertBeforeNode: function(refNode) {
      assert.argumentTypes(refNode, Node);
      this._insert(refNode.parentNode, (function(parent, df) {
        parent.insertBefore(df, refNode);
      }));
    },
    _insertAfterNode: function(refNode) {
      assert.argumentTypes(refNode, Node);
      var nextNode = refNode.nextSibling;
      if (!nextNode) {
        this._appendToNode(refNode.parentNode);
      } else {
        this._insertBeforeNode(nextNode);
      }
    },
    _appendToNode: function(parent) {
      assert.argumentTypes(parent, Node);
      this._insert(parent, (function(parent, df) {
        parent.appendChild(df);
      }));
    },
    _insert: function(parent, impl) {
      this._removeIfNeeded();
      impl(parent, this._fragment);
      this._removed = false;
    }
  }, {});
  View.parameters = [[ArrayLikeOfNodes], [NodeInjector]];
  View.prototype.insertBeforeView.parameters = [[View]];
  View.prototype.insertAfterView.parameters = [[View]];
  View.prototype._insertBeforeNode.parameters = [[Node]];
  View.prototype._insertAfterNode.parameters = [[Node]];
  View.prototype._appendToNode.parameters = [[Node]];
  var ViewPort = function ViewPort(anchorNode, anchorInjector) {
    assert.argumentTypes(anchorNode, HTMLElement, anchorInjector, $traceurRuntime.type.any);
    this._anchorNode = anchorNode;
    this._anchorInjector = anchorInjector;
  };
  ($traceurRuntime.createClass)(ViewPort, {append: function(view) {
      assert.argumentTypes(view, View);
      view._insertAfterNode(this._anchorNode);
      view._injector.appendTo(this._anchorInjector);
    }}, {});
  ViewPort.parameters = [[HTMLElement], []];
  ViewPort.prototype.append.parameters = [[View]];
  return {
    get View() {
      return View;
    },
    get ViewPort() {
      return ViewPort;
    },
    __esModule: true
  };
});
