define(["rtts-assert", 'watchtower', 'watchtower', './parser', './ast'], function($__0,$__1,$__2,$__3,$__4) {
  "use strict";
  var __moduleName = "watch_parser";
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
  var $__9 = $traceurRuntime.assertObject($__1),
      AST = $__9.AST,
      ContextReferenceAST = $__9.ContextReferenceAST,
      CollectionAST = $__9.CollectionAST,
      MethodAST = $__9.MethodAST,
      FieldReadAST = $__9.FieldReadAST,
      PureFunctionAST = $__9.PureFunctionAST,
      ConstantAST = $__9.ConstantAST;
  var CollectionChangeRecord = $traceurRuntime.assertObject($__2).CollectionChangeRecord;
  var Parser = $traceurRuntime.assertObject($__3).Parser;
  var $__9 = $traceurRuntime.assertObject($__4),
      Expression = $__9.Expression,
      ArrayOfExpression = $__9.ArrayOfExpression,
      Chain = $__9.Chain,
      Filter = $__9.Filter,
      Assign = $__9.Assign,
      Conditional = $__9.Conditional,
      AccessScope = $__9.AccessScope,
      AccessMember = $__9.AccessMember,
      AccessKeyed = $__9.AccessKeyed,
      CallScope = $__9.CallScope,
      CallFunction = $__9.CallFunction,
      CallMember = $__9.CallMember,
      PrefixNot = $__9.PrefixNot,
      Binary = $__9.Binary,
      LiteralPrimitive = $__9.LiteralPrimitive,
      LiteralArray = $__9.LiteralArray,
      LiteralObject = $__9.LiteralObject,
      LiteralString = $__9.LiteralString,
      Literal = $__9.Literal;
  var scopeContextRef = new ContextReferenceAST();
  var WatchParser = function WatchParser(parser) {
    assert.argumentTypes(parser, Parser);
    this._parser = parser;
    this._id = 0;
    this._visitor = new WatchVisitor();
  };
  ($traceurRuntime.createClass)(WatchParser, {parse: function(exp, filters) {
      var collection = arguments[2] !== (void 0) ? arguments[2] : false;
      var context = arguments[3] !== (void 0) ? arguments[3] : null;
      assert.argumentTypes(exp, $traceurRuntime.type.string, filters, $traceurRuntime.type.any, collection, $traceurRuntime.type.any, context, $traceurRuntime.type.any);
      var contextRef = this._visitor.contextRef,
          ast;
      try {
        this._visitor.filters = filters;
        if (context != null) {
          this._visitor.contextRef = new ConstantAST(context, ("#" + this._id++));
        }
        ast = this._parser.parse(exp);
        return collection ? this._visitor.visitCollection(ast) : this._visitor.visit(ast);
      } finally {
        this._visitor.contextRef = contextRef;
        this._visitor.filters = null;
      }
    }}, {});
  WatchParser.parameters = [[Parser]];
  WatchParser.prototype.parse.parameters = [[$traceurRuntime.type.string], [], [], []];
  var WatchVisitor = function WatchVisitor() {
    this.contextRef = scopeContextRef;
  };
  ($traceurRuntime.createClass)(WatchVisitor, {
    visit: function(exp) {
      assert.argumentTypes(exp, Expression);
      exp.accept(this);
      assert(this.ast != null);
      try {
        return assert.returnType((this.ast), AST);
      } finally {
        this.ast = null;
      }
    },
    visitCollection: function(exp) {
      assert.argumentTypes(exp, Expression);
      return assert.returnType((new CollectionAST(this.visit(exp))), AST);
    },
    visitCallScope: function(exp) {
      assert.argumentTypes(exp, CallScope);
      this.ast = new MethodAST(this.contextRef, exp.name, this._toAst(exp.args));
    },
    visitCallMember: function(exp) {
      assert.argumentTypes(exp, CallMember);
      this.ast = new MethodAST(this.visit(exp.object), exp.name, this._toAst(exp.args));
    },
    visitAccessScope: function(exp) {
      assert.argumentTypes(exp, AccessScope);
      this.ast = new FieldReadAST(this.contextRef, exp.name);
    },
    visitAccessMember: function(exp) {
      assert.argumentTypes(exp, AccessMember);
      this.ast = new FieldReadAST(this.visit(exp.object), exp.name);
    },
    visitBinary: function(exp) {
      assert.argumentTypes(exp, Binary);
      this.ast = new PureFunctionAST(exp.operation, operationToFunction(exp.operation), [this.visit(exp.left), this.visit(exp.right)]);
    },
    visitPrefix: function(exp) {
      assert.argumentTypes(exp, PrefixNot);
      this.ast = new PureFunctionAST(exp.operation, operationToFunction(exp.operation), [this.visit(exp.expression)]);
    },
    visitConditional: function(exp) {
      assert.argumentTypes(exp, Conditional);
      this.ast = new PureFunctionAST('?:', operation_ternary, [this.visit(exp.condition), this.visit(exp.yes), this.visit(exp.no)]);
    },
    visitAccessKeyed: function(exp) {
      assert.argumentTypes(exp, AccessKeyed);
      this.ast = new PureFunctionAST('[]', operation_bracket, [this.visit(exp.object), this.visit(exp.key)]);
    },
    visitLiteralPrimitive: function(exp) {
      assert.argumentTypes(exp, LiteralPrimitive);
      this.ast = new ConstantAST(exp.value);
    },
    visitLiteralString: function(exp) {
      assert.argumentTypes(exp, LiteralString);
      this.ast = new ConstantAST(exp.value);
    },
    visitLiteralArray: function(exp) {
      assert.argumentTypes(exp, LiteralArray);
      var items = this._toAst(exp.elements);
      this.ast = new PureFunctionAST(("[" + items.join(', ') + "]"), arrayFn, items);
    },
    visitLiteralObject: function(exp) {
      assert.argumentTypes(exp, LiteralObject);
      var keys = exp.keys;
      var values = this._toAst(exp.values),
          kv = [],
          i,
          length;
      assert(keys.length == values.length);
      for (i = 0, length = keys.length; i < length; i++) {
        kv.push((keys[i] + ": " + values[i]));
      }
      this.ast = new PureFunctionAST(("{" + kv.join(', ') + "}"), mapFn(keys), values);
    },
    visitFilter: function(exp) {
      var $__10;
      var filterFunction = this.filters(exp.name);
      var args = [this.visitCollection(exp.expression)];
      ($__10 = args).push.apply($__10, $traceurRuntime.toObject(this._toAst(exp.args).map((function(ast) {
        return new CollectionAST(ast);
      }))));
      this.ast = new PureFunctionAST(("|" + exp.name), filterWrapper(filterFunction, args.length), args);
    },
    visitCallFunction: function(exp) {
      assert.argumentTypes(exp, CallFunction);
      this._notSupported("function's returning functions");
    },
    visitAssign: function(exp) {
      assert.argumentTypes(exp, Assign);
      this._notSupported('assignement');
    },
    visitLiteral: function(exp) {
      assert.argumentTypes(exp, Literal);
      this._notSupported('literal');
    },
    visitExpression: function(exp) {
      assert.argumentTypes(exp, Expression);
      this._notSupported('?');
    },
    visitChain: function(exp) {
      assert.argumentTypes(exp, Chain);
      this._notSupported(';');
    },
    _notSupported: function(name) {
      assert.argumentTypes(name, $traceurRuntime.type.string);
      throw new Error(("Can not watch expression containing '" + name + "'."));
    },
    _toAst: function(expressions) {
      var $__5 = this;
      return expressions.map((function(exp) {
        return $__5.visit(exp);
      }));
    }
  }, {});
  WatchVisitor.prototype.visit.parameters = [[Expression]];
  WatchVisitor.prototype.visitCollection.parameters = [[Expression]];
  WatchVisitor.prototype.visitCallScope.parameters = [[CallScope]];
  WatchVisitor.prototype.visitCallMember.parameters = [[CallMember]];
  WatchVisitor.prototype.visitAccessScope.parameters = [[AccessScope]];
  WatchVisitor.prototype.visitAccessMember.parameters = [[AccessMember]];
  WatchVisitor.prototype.visitBinary.parameters = [[Binary]];
  WatchVisitor.prototype.visitPrefix.parameters = [[PrefixNot]];
  WatchVisitor.prototype.visitConditional.parameters = [[Conditional]];
  WatchVisitor.prototype.visitAccessKeyed.parameters = [[AccessKeyed]];
  WatchVisitor.prototype.visitLiteralPrimitive.parameters = [[LiteralPrimitive]];
  WatchVisitor.prototype.visitLiteralString.parameters = [[LiteralString]];
  WatchVisitor.prototype.visitLiteralArray.parameters = [[LiteralArray]];
  WatchVisitor.prototype.visitLiteralObject.parameters = [[LiteralObject]];
  WatchVisitor.prototype.visitFilter.parameters = [[Filter]];
  WatchVisitor.prototype.visitCallFunction.parameters = [[CallFunction]];
  WatchVisitor.prototype.visitAssign.parameters = [[Assign]];
  WatchVisitor.prototype.visitLiteral.parameters = [[Literal]];
  WatchVisitor.prototype.visitExpression.parameters = [[Expression]];
  WatchVisitor.prototype.visitChain.parameters = [[Chain]];
  WatchVisitor.prototype._notSupported.parameters = [[$traceurRuntime.type.string]];
  WatchVisitor.prototype._toAst.parameters = [[ArrayOfExpression]];
  function operationToFunction(operation) {
    assert.argumentTypes(operation, $traceurRuntime.type.string);
    switch (operation) {
      case '!':
        return function(value) {
          return !value;
        };
      case '+':
        return function(left, right) {
          return autoConvertAdd(left, right);
        };
      case '-':
        return function(left, right) {
          return (left != null && right != null) ? left - right : (left != null ? left : (right != null ? 0 - right : 0));
        };
      case '*':
        return function(left, right) {
          return (left == null || right == null) ? null : left * right;
        };
      case '/':
        return function(left, right) {
          return (left == null || right == null) ? null : left / right;
        };
      case '~/':
        return function(left, right) {
          return (left == null || right == null) ? null : Math.floor(left / right);
        };
      case '%':
        return function(left, right) {
          return (left == null || right == null) ? null : left % right;
        };
      case '==':
        return function(left, right) {
          return left == right;
        };
      case '!=':
        return function(left, right) {
          return left != right;
        };
      case '<':
        return function(left, right) {
          return (left == null || right == null) ? null : left < right;
        };
      case '>':
        return function(left, right) {
          return (left == null || right == null) ? null : left > right;
        };
      case '<=':
        return function(left, right) {
          return (left == null || right == null) ? null : left <= right;
        };
      case '>=':
        return function(left, right) {
          return (left == null || right == null) ? null : left >= right;
        };
      case '^':
        return function(left, right) {
          return (left == null || right == null) ? null : left ^ right;
        };
      case '&':
        return function(left, right) {
          return (left == null || right == null) ? null : left & right;
        };
      case '&&':
        return function(left, right) {
          return !!left && !!right;
        };
      case '||':
        return function(left, right) {
          return !!left || !!right;
        };
      default:
        throw new Error(operation);
    }
  }
  operationToFunction.parameters = [[$traceurRuntime.type.string]];
  function operation_ternary(condition, yes, no) {
    return !!condition ? yes : no;
  }
  function operation_bracket(obj, key) {
    return obj == null ? null : obj[key];
  }
  function autoConvertAdd(a, b) {
    if (a != null && b != null) {
      if (typeof a == 'string' && typeof b != 'string') {
        return a + b.toString();
      }
      if (typeof a != 'string' && typeof b == 'string') {
        return a.toString() + b;
      }
      return a + b;
    }
    if (a != null) {
      return a;
    }
    if (b != null) {
      return b;
    }
    return 0;
  }
  function arrayFn() {
    for (var existing = [],
        $__7 = 0; $__7 < arguments.length; $__7++)
      existing[$__7] = arguments[$__7];
    return existing;
  }
  function mapFn(keys) {
    return function() {
      for (var values = [],
          $__8 = 0; $__8 < arguments.length; $__8++)
        values[$__8] = arguments[$__8];
      assert(values.length == keys.length);
      var instance = {},
          length = keys.length,
          i;
      for (i = 0; i < length; i++) {
        instance[keys[i]] = values[i];
      }
      return instance;
    };
  }
  function filterWrapper(filterFn, length) {
    var args = [],
        argsWatches = [];
    return function() {
      for (var values = [],
          $__8 = 0; $__8 < arguments.length; $__8++)
        values[$__8] = arguments[$__8];
      for (var i = 0,
          length = values.length; i < length; i++) {
        var value = values[i];
        var lastValue = args[i];
        if (value !== lastValue) {
          if (value instanceof CollectionChangeRecord) {
            args[i] = value.iterable;
          } else {
            args[i] = value;
          }
        }
      }
      var value = filterFn.apply(null, $traceurRuntime.toObject(args));
      return value;
    };
  }
  function assert(condition, message) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  }
  return {
    get WatchParser() {
      return WatchParser;
    },
    __esModule: true
  };
});
