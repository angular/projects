define(["rtts-assert", './types', 'rtts-assert'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "ast";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var ArrayOfString = $traceurRuntime.assertObject($__1).ArrayOfString;
  var assert = $traceurRuntime.assertObject($__2).assert;
  var Expression = function Expression() {
    this.isChain = false;
    this.isAssignable = false;
  };
  ($traceurRuntime.createClass)(Expression, {
    eval: function() {
      throw new Error(("Cannot evaluate " + this));
    },
    assign: function() {
      throw new Error(("Cannot assign to " + this));
    },
    bind: function(context, wrapper) {
      return new BoundExpression(this, context, wrapper);
    },
    toString: function() {
      return Unparser.unparse(this);
    }
  }, {});
  var ArrayOfExpression = function ArrayOfExpression() {
    assert.fail('type is not instantiable');
  };
  ($traceurRuntime.createClass)(ArrayOfExpression, {}, {assert: function(obj) {
      assert(obj).is(assert.arrayOf(Expression));
    }});
  var BoundExpression = function BoundExpression(expression, context) {
    var wrapper = arguments[2] !== (void 0) ? arguments[2] : null;
    assert.argumentTypes(expression, Expression, context, $traceurRuntime.type.any, wrapper, Function);
    this.expression = expression;
    this._context = context;
    this._wrapper = wrapper;
  };
  ($traceurRuntime.createClass)(BoundExpression, {
    eval: function() {
      var locals = arguments[0] !== (void 0) ? arguments[0] : null;
      return this.expression.eval(this._computeContext(locals));
    },
    assign: function(value) {
      var locals = arguments[1] !== (void 0) ? arguments[1] : null;
      return this.expression.assign(this._computeContext(locals), value);
    },
    _computeContext: function(locals) {
      if (locals == null) {
        return this._context;
      }
      if (this._wrapper) {
        return this._wrapper(this._context, locals);
      }
      throw new Error(("Locals " + locals + " provided, but missing wrapper."));
    }
  }, {});
  BoundExpression.parameters = [[Expression], [], [Function]];
  var Chain = function Chain(expressions) {
    assert.argumentTypes(expressions, ArrayOfExpression);
    $traceurRuntime.superCall(this, $Chain.prototype, "constructor", []);
    this.expressions = expressions;
    this.isChain = true;
  };
  var $Chain = Chain;
  ($traceurRuntime.createClass)(Chain, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var result,
          expressions = this.expressions,
          length = expressions.length,
          i;
      for (i = 0; i < length; i++) {
        var last = expressions[i].eval(scope, filters);
        if (last != null) {
          result = last;
        }
      }
      return result;
    },
    accept: function(visitor) {
      visitor.visitChain(this);
    }
  }, {}, Expression);
  Chain.parameters = [[ArrayOfExpression]];
  var Filter = function Filter(expression, name, args, allArgs) {
    assert.argumentTypes(expression, Expression, name, $traceurRuntime.type.string, args, ArrayOfExpression, allArgs, ArrayOfExpression);
    $traceurRuntime.superCall(this, $Filter.prototype, "constructor", []);
    this.expression = expression;
    this.name = name;
    this.args = args;
    this.allArgs = allArgs;
  };
  var $Filter = Filter;
  ($traceurRuntime.createClass)(Filter, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var filter = filters(this.name);
      if (!filter) {
        throw new Error(("No NgFilter: " + this.name + " found!"));
      }
      return filter.apply(null, evalList(scope, this.allArgs, filters));
    },
    accept: function(visitor) {
      visitor.visitFilter(this);
    }
  }, {}, Expression);
  Filter.parameters = [[Expression], [$traceurRuntime.type.string], [ArrayOfExpression], [ArrayOfExpression]];
  var Assign = function Assign(target, value) {
    assert.argumentTypes(target, Expression, value, Expression);
    $traceurRuntime.superCall(this, $Assign.prototype, "constructor", []);
    this.target = target;
    this.value = value;
  };
  var $Assign = Assign;
  ($traceurRuntime.createClass)(Assign, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      return this.target.assign(scope, this.value.eval(scope, filters));
    },
    accept: function(vistor) {
      vistor.visitAssign(this);
    }
  }, {}, Expression);
  Assign.parameters = [[Expression], [Expression]];
  var Conditional = function Conditional(condition, yes, no) {
    assert.argumentTypes(condition, Expression, yes, Expression, no, Expression);
    $traceurRuntime.superCall(this, $Conditional.prototype, "constructor", []);
    this.condition = condition;
    this.yes = yes;
    this.no = no;
  };
  var $Conditional = Conditional;
  ($traceurRuntime.createClass)(Conditional, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      return (!!this.condition.eval(scope)) ? this.yes.eval(scope) : this.no.eval(scope);
    },
    accept: function(visitor) {
      visitor.visitConditional(this);
    }
  }, {}, Expression);
  Conditional.parameters = [[Expression], [Expression], [Expression]];
  var AccessScope = function AccessScope(name) {
    assert.argumentTypes(name, $traceurRuntime.type.string);
    $traceurRuntime.superCall(this, $AccessScope.prototype, "constructor", []);
    this.name = name;
    this.isAssignable = true;
  };
  var $AccessScope = AccessScope;
  ($traceurRuntime.createClass)(AccessScope, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      return scope[this.name];
    },
    assign: function(scope, value) {
      return scope[this.name] = value;
    },
    accept: function(visitor) {
      visitor.visitAccessScope(this);
    }
  }, {}, Expression);
  AccessScope.parameters = [[$traceurRuntime.type.string]];
  var AccessMember = function AccessMember(object, name) {
    assert.argumentTypes(object, Expression, name, $traceurRuntime.type.string);
    $traceurRuntime.superCall(this, $AccessMember.prototype, "constructor", []);
    this.object = object;
    this.name = name;
    this.isAssignable = true;
  };
  var $AccessMember = AccessMember;
  ($traceurRuntime.createClass)(AccessMember, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var instance = this.object.eval(scope, filters);
      return instance == null ? null : instance[this.name];
    },
    assign: function(scope, value) {
      var instance = this.object.eval(scope);
      if (!instance) {
        instance = {};
        this.object.assign(scope, instance);
      }
      return instance[this.name] = value;
    },
    accept: function(visitor) {
      visitor.visitAccessMember(this);
    }
  }, {}, Expression);
  AccessMember.parameters = [[Expression], [$traceurRuntime.type.string]];
  var AccessKeyed = function AccessKeyed(object, key) {
    assert.argumentTypes(object, Expression, key, Expression);
    $traceurRuntime.superCall(this, $AccessKeyed.prototype, "constructor", []);
    this.object = object;
    this.key = key;
    this.isAssignable = true;
  };
  var $AccessKeyed = AccessKeyed;
  ($traceurRuntime.createClass)(AccessKeyed, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var instance = this.object.eval(scope, filters);
      var lookup = this.key.eval(scope, filters);
      return getKeyed(instance, lookup);
    },
    assign: function(scope, value) {
      var instance = this.object.eval(scope);
      var lookup = this.key.eval(scope);
      return setKeyed(instance, lookup, value);
    },
    accept: function(visitor) {
      visitor.visitAccessKeyed(this);
    }
  }, {}, Expression);
  AccessKeyed.parameters = [[Expression], [Expression]];
  var CallScope = function CallScope(name, args) {
    assert.argumentTypes(name, $traceurRuntime.type.string, args, ArrayOfExpression);
    $traceurRuntime.superCall(this, $CallScope.prototype, "constructor", []);
    this.name = name;
    this.args = args;
  };
  var $CallScope = CallScope;
  ($traceurRuntime.createClass)(CallScope, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var args = evalList(scope, this.args, filters);
      return ensureFunctionFromMap(scope, this.name).apply(scope, args);
    },
    accept: function(visitor) {
      visitor.visitCallScope(this);
    }
  }, {}, Expression);
  CallScope.parameters = [[$traceurRuntime.type.string], [ArrayOfExpression]];
  var CallMember = function CallMember(object, name, args) {
    assert.argumentTypes(object, Expression, name, $traceurRuntime.type.string, args, ArrayOfExpression);
    $traceurRuntime.superCall(this, $CallMember.prototype, "constructor", []);
    this.object = object;
    this.name = name;
    this.args = args;
  };
  var $CallMember = CallMember;
  ($traceurRuntime.createClass)(CallMember, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var instance = this.object.eval(scope, filters);
      var args = evalList(scope, this.args, filters);
      return ensureFunctionFromMap(instance, this.name).apply(instance, args);
    },
    accept: function(visitor) {
      visitor.visitCallMember(this);
    }
  }, {}, Expression);
  CallMember.parameters = [[Expression], [$traceurRuntime.type.string], [ArrayOfExpression]];
  var CallFunction = function CallFunction(func, args) {
    assert.argumentTypes(func, Expression, args, ArrayOfExpression);
    $traceurRuntime.superCall(this, $CallFunction.prototype, "constructor", []);
    this.func = func;
    this.args = args;
  };
  var $CallFunction = CallFunction;
  ($traceurRuntime.createClass)(CallFunction, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var func = this.func.eval(scope, filters);
      if (typeof func != 'function') {
        throw new Error((this.func + " is not a function"));
      } else {
        return func.apply(null, evalList(scope, this.args, filters));
      }
    },
    accept: function(visitor) {
      visitor.visitCallFunction(this);
    }
  }, {}, Expression);
  CallFunction.parameters = [[Expression], [ArrayOfExpression]];
  var Binary = function Binary(operation, left, right) {
    assert.argumentTypes(operation, $traceurRuntime.type.string, left, Expression, right, Expression);
    $traceurRuntime.superCall(this, $Binary.prototype, "constructor", []);
    this.operation = operation;
    this.left = left;
    this.right = right;
  };
  var $Binary = Binary;
  ($traceurRuntime.createClass)(Binary, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var left = this.left.eval(scope);
      switch (this.operation) {
        case '&&':
          return !!left && !!this.right.eval(scope);
        case '||':
          return !!left || !!this.right.eval(scope);
      }
      var right = this.right.eval(scope);
      if (left == null || right == null) {
        switch (this.operation) {
          case '+':
            if (left != null)
              return left;
            if (right != null)
              return right;
            return 0;
          case '-':
            if (left != null)
              return left;
            if (right != null)
              return 0 - right;
            return 0;
        }
        return null;
      }
      switch (this.operation) {
        case '+':
          return autoConvertAdd(left, right);
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          return left / right;
        case '~/':
          return Math.floor(left / right);
        case '%':
          return left % right;
        case '==':
          return left == right;
        case '!=':
          return left != right;
        case '<':
          return left < right;
        case '>':
          return left > right;
        case '<=':
          return left <= right;
        case '>=':
          return left >= right;
        case '^':
          return left ^ right;
        case '&':
          return left & right;
      }
      throw new Error(("Internal error [" + this.operation + "] not handled"));
    },
    accept: function(visitor) {
      visitor.visitBinary(this);
    }
  }, {}, Expression);
  Binary.parameters = [[$traceurRuntime.type.string], [Expression], [Expression]];
  var PrefixNot = function PrefixNot(operation, expression) {
    assert.argumentTypes(operation, $traceurRuntime.type.string, expression, Expression);
    $traceurRuntime.superCall(this, $PrefixNot.prototype, "constructor", []);
    this.operation = operation;
    this.expression = expression;
  };
  var $PrefixNot = PrefixNot;
  ($traceurRuntime.createClass)(PrefixNot, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      return !this.expression.eval(scope);
    },
    accept: function(visitor) {
      visitor.visitPrefix(this);
    }
  }, {}, Expression);
  PrefixNot.parameters = [[$traceurRuntime.type.string], [Expression]];
  var LiteralPrimitive = function LiteralPrimitive(value) {
    $traceurRuntime.superCall(this, $LiteralPrimitive.prototype, "constructor", []);
    this.value = value;
  };
  var $LiteralPrimitive = LiteralPrimitive;
  ($traceurRuntime.createClass)(LiteralPrimitive, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      return this.value;
    },
    accept: function(visitor) {
      visitor.visitLiteralPrimitive(this);
    }
  }, {}, Expression);
  var LiteralString = function LiteralString(value) {
    assert.argumentTypes(value, $traceurRuntime.type.string);
    $traceurRuntime.superCall(this, $LiteralString.prototype, "constructor", []);
    this.value = value;
  };
  var $LiteralString = LiteralString;
  ($traceurRuntime.createClass)(LiteralString, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      return this.value;
    },
    accept: function(visitor) {
      visitor.visitLiteralString(this);
    }
  }, {}, Expression);
  LiteralString.parameters = [[$traceurRuntime.type.string]];
  var LiteralArray = function LiteralArray(elements) {
    assert.argumentTypes(elements, ArrayOfExpression);
    $traceurRuntime.superCall(this, $LiteralArray.prototype, "constructor", []);
    this.elements = elements;
  };
  var $LiteralArray = LiteralArray;
  ($traceurRuntime.createClass)(LiteralArray, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var elements = this.elements,
          length = elements.length,
          result = [],
          i;
      for (i = 0; i < length; i++) {
        result[i] = elements[i].eval(scope, filters);
      }
      return result;
    },
    accept: function(visitor) {
      visitor.visitLiteralArray(this);
    }
  }, {}, Expression);
  LiteralArray.parameters = [[ArrayOfExpression]];
  var LiteralObject = function LiteralObject(keys, values) {
    assert.argumentTypes(keys, ArrayOfString, values, ArrayOfExpression);
    $traceurRuntime.superCall(this, $LiteralObject.prototype, "constructor", []);
    this.keys = keys;
    this.values = values;
  };
  var $LiteralObject = LiteralObject;
  ($traceurRuntime.createClass)(LiteralObject, {
    eval: function(scope) {
      var filters = arguments[1] !== (void 0) ? arguments[1] : defaultFilterMap;
      var instance = {},
          keys = this.keys,
          values = this.values,
          length = keys.length,
          i;
      for (i = 0; i < length; i++) {
        instance[keys[i]] = values[i].eval(scope, filters);
      }
      return instance;
    },
    accept: function(visitor) {
      visitor.visitLiteralObject(this);
    }
  }, {}, Expression);
  LiteralObject.parameters = [[ArrayOfString], [ArrayOfExpression]];
  var Unparser = function Unparser(buffer) {
    assert.argumentTypes(buffer, ArrayOfString);
    this.buffer = buffer;
  };
  var $Unparser = Unparser;
  ($traceurRuntime.createClass)(Unparser, {
    write: function(text) {
      assert.argumentTypes(text, $traceurRuntime.type.string);
      this.buffer.push(text);
    },
    writeArgs: function(args) {
      assert.argumentTypes(args, ArrayOfExpression);
      this.write('(');
      for (var i = 0,
          length = args.length; i < length; i++) {
        if (i != 0) {
          this.write(',');
        }
        args[i].accept(this);
      }
      this.write(')');
    },
    visitChain: function(chain) {
      assert.argumentTypes(chain, Chain);
      var expressions = chain.expressions,
          length = expressions.length,
          i;
      for (i = 0; i < length; i++) {
        if (i != 0) {
          this.write(';');
        }
        expressions[i].accept(this);
      }
    },
    visitFilter: function(filter) {
      assert.argumentTypes(filter, Filter);
      var args = filter.args,
          length = args.length,
          i;
      this.write('(');
      filter.expression.accept(this);
      this.write(("|" + filter.name));
      for (i = 0; i < length; i++) {
        this.write(' :');
        args[i].accept(this);
      }
      this.write(')');
    },
    visitAssign: function(assign) {
      assert.argumentTypes(assign, Assign);
      assign.target.accept(this);
      this.write('=');
      assign.value.accept(this);
    },
    visitConditional: function(conditional) {
      assert.argumentTypes(conditional, Conditional);
      conditional.condition.accept(this);
      this.write('?');
      conditional.yes.accept(this);
      this.write(':');
      conditional.no.accept(this);
    },
    visitAccessScope: function(access) {
      assert.argumentTypes(access, AccessScope);
      this.write(access.name);
    },
    visitAccessMember: function(access) {
      assert.argumentTypes(access, AccessMember);
      access.object.accept(this);
      this.write(("." + access.name));
    },
    visitAccessKeyed: function(access) {
      assert.argumentTypes(access, AccessKeyed);
      access.object.accept(this);
      this.write('[');
      access.key.accept(this);
      this.write(']');
    },
    visitCallScope: function(call) {
      assert.argumentTypes(call, CallScope);
      this.write(call.name);
      this.writeArgs(call.args);
    },
    visitCallFunction: function(call) {
      assert.argumentTypes(call, CallFunction);
      call.func.accept(this);
      this.writeArgs(call.args);
    },
    visitCallMember: function(call) {
      assert.argumentTypes(call, CallMember);
      call.object.accept(this);
      this.write(("." + call.name));
      this.writeArgs(call.args);
    },
    visitPrefix: function(prefix) {
      assert.argumentTypes(prefix, PrefixNot);
      this.write(("(" + prefix.operation));
      prefix.expression.accept(this);
      this.write(')');
    },
    visitBinary: function(binary) {
      assert.argumentTypes(binary, Binary);
      this.write('(');
      binary.left.accept(this);
      this.write(binary.operation);
      binary.right.accept(this);
      this.write(')');
    },
    visitLiteralPrimitive: function(literal) {
      assert.argumentTypes(literal, LiteralPrimitive);
      this.write(("" + literal.value));
    },
    visitLiteralArray: function(literal) {
      assert.argumentTypes(literal, LiteralArray);
      var elements = literal.elements,
          length = elements.length,
          i;
      this.write('[');
      for (i = 0; i < length; i++) {
        if (i != 0) {
          this.write(',');
        }
        elements[i].accept(this);
      }
      this.write(']');
    },
    visitLiteralObject: function(literal) {
      assert.argumentTypes(literal, LiteralObject);
      var keys = literal.keys,
          values = literal.values,
          length = keys.length,
          i;
      this.write('{');
      for (i = 0; i < length; i++) {
        if (i != 0) {
          this.write(',');
        }
        this.write(("'" + keys[i] + "':"));
        values[i].accept(this);
      }
      this.write('}');
    },
    visitLiteralString: function(literal) {
      assert.argumentTypes(literal, LiteralString);
      var escaped = literal.value.replace(/'/g, "\'");
      this.write(("'" + escaped + "'"));
    }
  }, {unparse: function(expression) {
      assert.argumentTypes(expression, Expression);
      var buffer = [],
          visitor = new $Unparser(buffer);
      expression.accept(visitor);
      return buffer.join('');
    }});
  Unparser.parameters = [[ArrayOfString]];
  Unparser.unparse.parameters = [[Expression]];
  Unparser.prototype.write.parameters = [[$traceurRuntime.type.string]];
  Unparser.prototype.writeArgs.parameters = [[ArrayOfExpression]];
  Unparser.prototype.visitChain.parameters = [[Chain]];
  Unparser.prototype.visitFilter.parameters = [[Filter]];
  Unparser.prototype.visitAssign.parameters = [[Assign]];
  Unparser.prototype.visitConditional.parameters = [[Conditional]];
  Unparser.prototype.visitAccessScope.parameters = [[AccessScope]];
  Unparser.prototype.visitAccessMember.parameters = [[AccessMember]];
  Unparser.prototype.visitAccessKeyed.parameters = [[AccessKeyed]];
  Unparser.prototype.visitCallScope.parameters = [[CallScope]];
  Unparser.prototype.visitCallFunction.parameters = [[CallFunction]];
  Unparser.prototype.visitCallMember.parameters = [[CallMember]];
  Unparser.prototype.visitPrefix.parameters = [[PrefixNot]];
  Unparser.prototype.visitBinary.parameters = [[Binary]];
  Unparser.prototype.visitLiteralPrimitive.parameters = [[LiteralPrimitive]];
  Unparser.prototype.visitLiteralArray.parameters = [[LiteralArray]];
  Unparser.prototype.visitLiteralObject.parameters = [[LiteralObject]];
  Unparser.prototype.visitLiteralString.parameters = [[LiteralString]];
  function defaultFilterMap(name) {
    throw new Error(("No NgFilter: " + name + " found!"));
  }
  var evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];
  function evalList(scope, list) {
    var filters = arguments[2] !== (void 0) ? arguments[2] : defaultFilterMap;
    var length = list.length;
    for (var cacheLength = evalListCache.length; cacheLength <= length; cacheLength++) {
      _evalListCache.push([]);
    }
    var result = evalListCache[length];
    for (var i = 0; i < length; i++) {
      result[i] = list[i].eval(scope, filters);
    }
    return result;
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
  function ensureFunctionFromMap(obj, name) {
    assert.argumentTypes(obj, $traceurRuntime.type.any, name, $traceurRuntime.type.string);
    var func = obj[name];
    if (typeof func == 'function') {
      return func;
    }
    if (func == null) {
      throw new Error(("Undefined function " + name));
    } else {
      throw new Error((name + " is not a function"));
    }
  }
  ensureFunctionFromMap.parameters = [[], [$traceurRuntime.type.string]];
  function getKeyed(obj, key) {
    if (Array.isArray(obj)) {
      return obj[parseInt(key)];
    } else if (obj) {
      return obj[key];
    } else if (obj == null) {
      throw new Error('Accessing null object');
    } else {
      return obj[key];
    }
  }
  function setKeyed(obj, key, value) {
    if (Array.isArray(obj)) {
      var index = parseInt(key);
      if (obj.length <= index) {
        obj.length = index + 1;
      }
      obj[index] = value;
    } else {
      obj[key] = value;
    }
    return value;
  }
  return {
    get Expression() {
      return Expression;
    },
    get ArrayOfExpression() {
      return ArrayOfExpression;
    },
    get BoundExpression() {
      return BoundExpression;
    },
    get Chain() {
      return Chain;
    },
    get Filter() {
      return Filter;
    },
    get Assign() {
      return Assign;
    },
    get Conditional() {
      return Conditional;
    },
    get AccessScope() {
      return AccessScope;
    },
    get AccessMember() {
      return AccessMember;
    },
    get AccessKeyed() {
      return AccessKeyed;
    },
    get CallScope() {
      return CallScope;
    },
    get CallMember() {
      return CallMember;
    },
    get CallFunction() {
      return CallFunction;
    },
    get Binary() {
      return Binary;
    },
    get PrefixNot() {
      return PrefixNot;
    },
    get LiteralPrimitive() {
      return LiteralPrimitive;
    },
    get LiteralString() {
      return LiteralString;
    },
    get LiteralArray() {
      return LiteralArray;
    },
    get LiteralObject() {
      return LiteralObject;
    },
    get Unparser() {
      return Unparser;
    },
    __esModule: true
  };
});
