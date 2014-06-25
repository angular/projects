define(["rtts-assert", './lexer', './ast'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "parser";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var $__4 = $traceurRuntime.assertObject($__1),
      Lexer = $__4.Lexer,
      Token = $__4.Token;
  var $__4 = $traceurRuntime.assertObject($__2),
      Expression = $__4.Expression,
      ArrayOfExpression = $__4.ArrayOfExpression,
      Chain = $__4.Chain,
      Filter = $__4.Filter,
      Assign = $__4.Assign,
      Conditional = $__4.Conditional,
      AccessScope = $__4.AccessScope,
      AccessMember = $__4.AccessMember,
      AccessKeyed = $__4.AccessKeyed,
      CallScope = $__4.CallScope,
      CallFunction = $__4.CallFunction,
      CallMember = $__4.CallMember,
      PrefixNot = $__4.PrefixNot,
      Binary = $__4.Binary,
      LiteralPrimitive = $__4.LiteralPrimitive,
      LiteralArray = $__4.LiteralArray,
      LiteralObject = $__4.LiteralObject,
      LiteralString = $__4.LiteralString;
  var EOF = new Token(-1, null);
  var Parser = function Parser() {
    this.cache = {};
    this.lexer = new Lexer();
  };
  ($traceurRuntime.createClass)(Parser, {parse: function(input) {
      assert.argumentTypes(input, $traceurRuntime.type.string);
      input = input || '';
      return assert.returnType((this.cache[input] || (this.cache[input] = new ParserImplementation(this.lexer, input).parseChain())), Expression);
    }}, {});
  Parser.prototype.parse.parameters = [[$traceurRuntime.type.string]];
  var ParserImplementation = function ParserImplementation(lexer, input) {
    assert.argumentTypes(lexer, Lexer, input, $traceurRuntime.type.string);
    this.index = 0;
    this.input = input;
    this.tokens = lexer.lex(input);
  };
  ($traceurRuntime.createClass)(ParserImplementation, {
    get peek() {
      return (this.index < this.tokens.length) ? this.tokens[this.index] : EOF;
    },
    parseChain: function() {
      var isChain = false,
          expressions = [];
      while (this.optional(';')) {
        isChain = true;
      }
      while (this.index < this.tokens.length) {
        if (this.peek.text == ')' || this.peek.text == '}' || this.peek.text == ']') {
          this.error(("Unconsumed token " + this.peek.text));
        }
        var expr = this.parseFilter();
        expressions.push(expr);
        while (this.optional(';')) {
          isChain = true;
        }
        if (isChain && expr instanceof Filter) {
          this.error('cannot have a filter in a chain');
        }
      }
      return assert.returnType(((expressions.length == 1) ? expressions[0] : new Chain(expressions)), Expression);
    },
    parseFilter: function() {
      var result = this.parseExpression();
      while (this.optional('|')) {
        var name = this.peek.text,
            args = [];
        this.advance();
        while (this.optional(':')) {
          args.push(this.parseExpression());
        }
        result = new Filter(result, name, args, [result].concat(args));
      }
      return assert.returnType((result), Expression);
    },
    parseExpression: function() {
      var start = this.peek.index,
          result = this.parseConditional();
      while (this.peek.text == '=') {
        if (!result.isAssignable) {
          var end = (this.index < this.tokens.length) ? this.peek.index : this.input.length;
          var expression = this.input.substring(start, end);
          this.error(("Expression " + expression + " is not assignable"));
        }
        this.expect('=');
        result = new Assign(result, this.parseConditional());
      }
      return assert.returnType((result), Expression);
    },
    parseConditional: function() {
      var start = this.peek.index,
          result = this.parseLogicalOr();
      if (this.optional('?')) {
        var yes = this.parseExpression();
        if (!this.optional(':')) {
          var end = (this.index < this.tokens.length) ? this.peek.index : this.input.length;
          var expression = this.input.substring(start, end);
          this.error(("Conditional expression " + expression + " requires all 3 expressions"));
        }
        var no = this.parseExpression();
        result = new Conditional(result, yes, no);
      }
      return assert.returnType((result), Expression);
    },
    parseLogicalOr: function() {
      var result = this.parseLogicalAnd();
      while (this.optional('||')) {
        result = new Binary('||', result, this.parseLogicalAnd());
      }
      return assert.returnType((result), Expression);
    },
    parseLogicalAnd: function() {
      var result = this.parseEquality();
      while (this.optional('&&')) {
        result = new Binary('&&', result, this.parseEquality());
      }
      return assert.returnType((result), Expression);
    },
    parseEquality: function() {
      var result = this.parseRelational();
      while (true) {
        if (this.optional('==')) {
          result = new Binary('==', result, this.parseRelational());
        } else if (this.optional('!=')) {
          result = new Binary('!=', result, this.parseRelational());
        } else {
          return assert.returnType((result), Expression);
        }
      }
    },
    parseRelational: function() {
      var result = this.parseAdditive();
      while (true) {
        if (this.optional('<')) {
          result = new Binary('<', result, this.parseAdditive());
        } else if (this.optional('>')) {
          result = new Binary('>', result, this.parseAdditive());
        } else if (this.optional('<=')) {
          result = new Binary('<=', result, this.parseAdditive());
        } else if (this.optional('>=')) {
          result = new Binary('>=', result, this.parseAdditive());
        } else {
          return assert.returnType((result), Expression);
        }
      }
    },
    parseAdditive: function() {
      var result = this.parseMultiplicative();
      while (true) {
        if (this.optional('+')) {
          result = new Binary('+', result, this.parseMultiplicative());
        } else if (this.optional('-')) {
          result = new Binary('-', result, this.parseMultiplicative());
        } else {
          return assert.returnType((result), Expression);
        }
      }
    },
    parseMultiplicative: function() {
      var result = this.parsePrefix();
      while (true) {
        if (this.optional('*')) {
          result = new Binary('*', result, this.parsePrefix());
        } else if (this.optional('%')) {
          result = new Binary('%', result, this.parsePrefix());
        } else if (this.optional('/')) {
          result = new Binary('/', result, this.parsePrefix());
        } else if (this.optional('~/')) {
          result = new Binary('~/', result, this.parsePrefix());
        } else {
          return assert.returnType((result), Expression);
        }
      }
    },
    parsePrefix: function() {
      if (this.optional('+')) {
        return assert.returnType((this.parsePrefix()), Expression);
      } else if (this.optional('-')) {
        return assert.returnType((new Binary('-', new LiteralPrimitive(0), this.parsePrefix())), Expression);
      } else if (this.optional('!')) {
        return assert.returnType((new PrefixNot('!', this.parsePrefix())), Expression);
      } else {
        return assert.returnType((this.parseAccessOrCallMember()), Expression);
      }
    },
    parseAccessOrCallMember: function() {
      var result = this.parsePrimary();
      while (true) {
        if (this.optional('.')) {
          var name = this.peek.text;
          this.advance();
          if (this.optional('(')) {
            var args = this.parseExpressionList(')');
            this.expect(')');
            result = new CallMember(result, name, args);
          } else {
            result = new AccessMember(result, name);
          }
        } else if (this.optional('[')) {
          var key = this.parseExpression();
          this.expect(']');
          result = new AccessKeyed(result, key);
        } else if (this.optional('(')) {
          var args = this.parseExpressionList(')');
          this.expect(')');
          result = new CallFunction(result, args);
        } else {
          return assert.returnType((result), Expression);
        }
      }
    },
    parsePrimary: function() {
      if (this.optional('(')) {
        var result = this.parseExpression();
        this.expect(')');
        return assert.returnType((result), Expression);
      } else if (this.optional('null') || this.optional('undefined')) {
        return assert.returnType((new LiteralPrimitive(null)), Expression);
      } else if (this.optional('true')) {
        return assert.returnType((new LiteralPrimitive(true)), Expression);
      } else if (this.optional('false')) {
        return assert.returnType((new LiteralPrimitive(false)), Expression);
      } else if (this.optional('[')) {
        var elements = this.parseExpressionList(']');
        this.expect(']');
        return assert.returnType((new LiteralArray(elements)), Expression);
      } else if (this.peek.text == '{') {
        return assert.returnType((this.parseObject()), Expression);
      } else if (this.peek.key != null) {
        return assert.returnType((this.parseAccessOrCallScope()), Expression);
      } else if (this.peek.value != null) {
        var value = this.peek.value;
        this.advance();
        return assert.returnType((isNaN(value) ? new LiteralString(value) : new LiteralPrimitive(value)), Expression);
      } else if (this.index >= this.tokens.length) {
        throw new Error(("Unexpected end of expression: " + this.input));
      } else {
        this.error(("Unexpected token " + this.peek.text));
      }
    },
    parseAccessOrCallScope: function() {
      var name = this.peek.key;
      this.advance();
      if (!this.optional('(')) {
        return assert.returnType((new AccessScope(name)), Expression);
      }
      var args = this.parseExpressionList(')');
      this.expect(')');
      return assert.returnType((new CallScope(name, args)), Expression);
    },
    parseObject: function() {
      var keys = [],
          values = [];
      this.expect('{');
      if (this.peek.text != '}') {
        do {
          var value = this.peek.value;
          keys.push(typeof value == 'string' ? value : this.peek.text);
          this.advance();
          this.expect(':');
          values.push(this.parseExpression());
        } while (this.optional(','));
      }
      this.expect('}');
      return assert.returnType((new LiteralObject(keys, values)), Expression);
    },
    parseExpressionList: function(terminator) {
      assert.argumentTypes(terminator, $traceurRuntime.type.string);
      var result = [];
      if (this.peek.text != terminator) {
        do {
          result.push(this.parseExpression());
        } while (this.optional(','));
      }
      return assert.returnType((result), ArrayOfExpression);
    },
    optional: function(text) {
      assert.argumentTypes(text, $traceurRuntime.type.string);
      if (this.peek.text == text) {
        this.advance();
        return assert.returnType((true), $traceurRuntime.type.boolean);
      }
      return assert.returnType((false), $traceurRuntime.type.boolean);
    },
    expect: function(text) {
      assert.argumentTypes(text, $traceurRuntime.type.string);
      if (this.peek.text == text) {
        this.advance();
      } else {
        this.error(("Missing expected " + text));
      }
    },
    advance: function() {
      this.index++;
    },
    error: function(message) {
      assert.argumentTypes(message, $traceurRuntime.type.string);
      var location = (this.index < this.tokens.length) ? ("at column " + (this.tokens[this.index].index + 1) + " in") : "at the end of the expression";
      throw new Error(("Parser Error: " + message + " " + location + " [" + this.input + "]"));
    }
  }, {});
  ParserImplementation.parameters = [[Lexer], [$traceurRuntime.type.string]];
  ParserImplementation.prototype.parseExpressionList.parameters = [[$traceurRuntime.type.string]];
  ParserImplementation.prototype.optional.parameters = [[$traceurRuntime.type.string]];
  ParserImplementation.prototype.expect.parameters = [[$traceurRuntime.type.string]];
  ParserImplementation.prototype.error.parameters = [[$traceurRuntime.type.string]];
  return {
    get Parser() {
      return Parser;
    },
    get ParserImplementation() {
      return ParserImplementation;
    },
    __esModule: true
  };
});
