define(["rtts-assert", 'rtts-assert', '../types'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "tree_array";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var assert = $traceurRuntime.assertObject($__1).assert;
  var TreeArray = $traceurRuntime.assertObject($__2).TreeArray;
  function reduceTree(tree, reduceCallback) {
    var initValue = arguments[2] !== (void 0) ? arguments[2] : null;
    assert.argumentTypes(tree, TreeArray, reduceCallback, $traceurRuntime.type.any, initValue, $traceurRuntime.type.any);
    var stack = [],
        i,
        currNode,
        prevValue,
        leafeValues = [];
    for (i = 0; i < tree.length; i++) {
      currNode = tree[i];
      if (stack.length > currNode.level) {
        leafeValues.push(stack[stack.length - 1]);
      }
      stack.splice(currNode.level, stack.length - currNode.level);
      prevValue = stack.length ? stack[stack.length - 1] : initValue;
      stack.push(reduceCallback(prevValue, currNode, i, tree));
    }
    leafeValues.push(stack[stack.length - 1]);
    return leafeValues;
  }
  reduceTree.parameters = [[TreeArray], [], []];
  return {
    get reduceTree() {
      return reduceTree;
    },
    __esModule: true
  };
});
