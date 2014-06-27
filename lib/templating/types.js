define(['rtts-assert'], function($__0) {
  "use strict";
  var __moduleName = "types";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var NodeContainer = assert.define('NodeContainer', function(obj) {
    assert(obj).is(assert.structure({
      childNodes: ArrayLikeOfNodes,
      nodeType: assert.number
    }));
  });
  var ArrayLikeOfNodes = assert.define('ArrayLikeOfNodes', function(obj) {
    assert(obj.length).is(assert.number);
    for (var i = 0,
        ii = obj.length; i < ii; i++) {
      assert(obj[i]).is(Node);
    }
  });
  var ArrayOfObject = assert.define('ArrayOfObject', function(obj) {
    assert(obj).is(assert.arrayOf(assert.object));
  });
  var ArrayOfString = assert.define('ArrayOfString', function(obj) {
    assert(obj).is(assert.arrayOf(assert.string));
  });
  var ArrayOfClass = assert.define('ArrayOfClass', function(obj) {
    assert(obj).is(assert.arrayOf(Function));
  });
  var AbstractNodeBinder = assert.define('AbstractNodeBinder', function(obj) {
    assert(obj).is(assert.structure({attrs: Object}));
  });
  var CompiledTemplate = assert.define('CompiledTemplate', function(obj) {
    assert(obj).is(assert.structure({
      container: NodeContainer,
      binders: assert.arrayOf(ElementBinder)
    }));
    assert(obj.binders).is(TreeArray);
  });
  var ElementBinder = assert.define('ElementBinder', function(obj) {
    AbstractNodeBinder.assert(obj);
    assert(obj).is(assert.structure({
      decorators: ArrayOfClass,
      component: Function,
      template: assert.structure({
        compiledTemplate: CompiledTemplate,
        directive: Function
      }),
      textBinders: assert.arrayOf(TextBinder)
    }));
  });
  var TextBinder = assert.define('TextBinder', function(obj) {
    assert(obj).is(assert.structure({
      indexInParent: assert.number,
      expression: assert.string
    }));
  });
  var TreeArrayNode = assert.define('TreeArrayNode', function(obj) {
    assert(obj).is(assert.structure({level: assert.number}));
  });
  var TreeArray = assert.define('TreeArray', function(obj) {
    assert(obj).is(assert.arrayOf(TreeArrayNode));
    var prevLevel = -1;
    obj.forEach((function(node) {
      var newLevel = node.level;
      if (newLevel === null) {
        assert.fail('level must be set');
      }
      if (newLevel < 0) {
        assert.fail('level must be >=0');
      }
      if (newLevel >= prevLevel && newLevel - prevLevel > 1) {
        assert.fail("levels can't be skipped");
      }
      prevLevel = newLevel;
    }));
  });
  return {
    get NodeContainer() {
      return NodeContainer;
    },
    get ArrayLikeOfNodes() {
      return ArrayLikeOfNodes;
    },
    get ArrayOfObject() {
      return ArrayOfObject;
    },
    get ArrayOfString() {
      return ArrayOfString;
    },
    get ArrayOfClass() {
      return ArrayOfClass;
    },
    get AbstractNodeBinder() {
      return AbstractNodeBinder;
    },
    get CompiledTemplate() {
      return CompiledTemplate;
    },
    get ElementBinder() {
      return ElementBinder;
    },
    get TextBinder() {
      return TextBinder;
    },
    get TreeArrayNode() {
      return TreeArrayNode;
    },
    get TreeArray() {
      return TreeArray;
    },
    __esModule: true
  };
});
