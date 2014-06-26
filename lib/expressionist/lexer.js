define(["rtts-assert"], function($__0) {
  "use strict";
  var __moduleName = "lexer";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var assert = $traceurRuntime.assertObject($__0).assert;
  var Token = function Token(index, text) {
    assert.argumentTypes(index, $traceurRuntime.type.number, text, $traceurRuntime.type.string);
    this.index = index;
    this.text = text;
  };
  ($traceurRuntime.createClass)(Token, {
    withOp: function(op) {
      this.opKey = op;
      return this;
    },
    withGetterSetter: function(key) {
      this.key = key;
      return this;
    },
    withValue: function(value) {
      this.value = value;
      return this;
    },
    toString: function() {
      return ("Token(" + this.text + ")");
    }
  }, {});
  Token.parameters = [[$traceurRuntime.type.number], [$traceurRuntime.type.string]];
  var ArrayOfToken = function ArrayOfToken() {
    assert.fail('type is not instantiable');
  };
  ($traceurRuntime.createClass)(ArrayOfToken, {}, {assert: function(obj) {
      assert(obj).is(assert.arrayOf(Token));
    }});
  var Lexer = function Lexer() {};
  ($traceurRuntime.createClass)(Lexer, {lex: function(text) {
      assert.argumentTypes(text, $traceurRuntime.type.string);
      var scanner = new Scanner(text);
      var tokens = [];
      var token = scanner.scanToken();
      while (token) {
        tokens.push(token);
        token = scanner.scanToken();
      }
      return assert.returnType((tokens), ArrayOfToken);
    }}, {});
  Lexer.prototype.lex.parameters = [[$traceurRuntime.type.string]];
  var Scanner = function Scanner(input) {
    assert.argumentTypes(input, $traceurRuntime.type.string);
    this.input = input;
    this.length = input.length;
    this.peek = 0;
    this.index = -1;
    this.advance();
  };
  ($traceurRuntime.createClass)(Scanner, {
    scanToken: function() {
      while (this.peek <= $SPACE) {
        if (++this.index >= this.length) {
          this.peek = $EOF;
          return assert.returnType((null), Token);
        } else {
          this.peek = this.input.charCodeAt(this.index);
        }
      }
      if (isIdentifierStart(this.peek)) {
        return assert.returnType((this.scanIdentifier()), Token);
      }
      if (isDigit(this.peek)) {
        return assert.returnType((this.scanNumber(this.index)), Token);
      }
      var start = this.index;
      switch (this.peek) {
        case $PERIOD:
          this.advance();
          return assert.returnType((isDigit(this.peek) ? this.scanNumber(start) : new Token(start, '.')), Token);
        case $LPAREN:
        case $RPAREN:
        case $LBRACE:
        case $RBRACE:
        case $LBRACKET:
        case $RBRACKET:
        case $COMMA:
        case $COLON:
        case $SEMICOLON:
          return assert.returnType((this.scanCharacter(start, String.fromCharCode(this.peek))), Token);
        case $SQ:
        case $DQ:
          return assert.returnType((this.scanString()), Token);
        case $PLUS:
        case $MINUS:
        case $STAR:
        case $SLASH:
        case $PERCENT:
        case $CARET:
        case $QUESTION:
          return assert.returnType((this.scanOperator(start, String.fromCharCode(this.peek))), Token);
        case $LT:
        case $GT:
        case $BANG:
        case $EQ:
          return assert.returnType((this.scanComplexOperator(start, $EQ, String.fromCharCode(this.peek), '=')), Token);
        case $AMPERSAND:
          return assert.returnType((this.scanComplexOperator(start, $AMPERSAND, '&', '&')), Token);
        case $BAR:
          return assert.returnType((this.scanComplexOperator(start, $BAR, '|', '|')), Token);
        case $TILDE:
          return assert.returnType((this.scanComplexOperator(start, $SLASH, '~', '/')), Token);
        case $NBSP:
          while (isWhitespace(this.peek)) {
            this.advance();
          }
          return assert.returnType((this.scanToken()), Token);
      }
      var character = String.fromCharCode(this.peek);
      this.error(("Unexpected character [" + character + "]"));
      return assert.returnType((null), Token);
    },
    scanCharacter: function(start, text) {
      assert.argumentTypes(start, $traceurRuntime.type.number, text, $traceurRuntime.type.string);
      assert(this.peek == text.charCodeAt(0));
      this.advance();
      return assert.returnType((new Token(start, text)), Token);
    },
    scanOperator: function(start, text) {
      assert.argumentTypes(start, $traceurRuntime.type.number, text, $traceurRuntime.type.string);
      assert(this.peek == text.charCodeAt(0));
      assert(OPERATORS.indexOf(text) != -1);
      this.advance();
      return assert.returnType((new Token(start, text).withOp(text)), Token);
    },
    scanComplexOperator: function(start, code, one, two) {
      assert.argumentTypes(start, $traceurRuntime.type.number, code, $traceurRuntime.type.number, one, $traceurRuntime.type.string, two, $traceurRuntime.type.string);
      assert(this.peek == one.charCodeAt(0));
      this.advance();
      var text = one;
      if (this.peek == code) {
        this.advance();
        text += two;
      }
      assert(OPERATORS.indexOf(text) != -1);
      return assert.returnType((new Token(start, text).withOp(text)), Token);
    },
    scanIdentifier: function() {
      assert(isIdentifierStart(this.peek));
      var start = this.index;
      this.advance();
      while (isIdentifierPart(this.peek)) {
        this.advance();
      }
      var text = this.input.substring(start, this.index);
      var result = new Token(start, text);
      if (OPERATORS.indexOf(text) != -1) {
        result.withOp(text);
      } else {
        result.withGetterSetter(text);
      }
      return assert.returnType((result), Token);
    },
    scanNumber: function(start) {
      assert.argumentTypes(start, $traceurRuntime.type.number);
      assert(isDigit(this.peek));
      var simple = (this.index == start);
      this.advance();
      while (true) {
        if (isDigit(this.peek)) {} else if (this.peek == $PERIOD) {
          simple = false;
        } else if (isExponentStart(this.peek)) {
          this.advance();
          if (isExponentSign(this.peek)) {
            this.advance();
          }
          if (!isDigit(this.peek)) {
            this.error('Invalid exponent', -1);
          }
          simple = false;
        } else {
          break;
        }
        this.advance();
      }
      var text = this.input.substring(start, this.index);
      var value = simple ? parseInt(text) : parseFloat(text);
      return assert.returnType((new Token(start, text).withValue(value)), Token);
    },
    scanString: function() {
      assert(this.peek == $SQ || this.peek == $DQ);
      var start = this.index;
      var quote = this.peek;
      this.advance();
      var buffer;
      var marker = this.index;
      while (this.peek != quote) {
        if (this.peek == $BACKSLASH) {
          if (buffer == null) {
            buffer = [];
          }
          buffer.push(this.input.substring(marker, this.index));
          this.advance();
          var unescaped;
          if (this.peek == $u) {
            var hex = this.input.substring(this.index + 1, this.index + 5);
            if (!/[A-Z0-9]{4}/.test(hex)) {
              this.error(("Invalid unicode escape [\\u" + hex + "]"));
            }
            unescaped = parseInt(hex, 16);
            for (var i = 0; i < 5; i++) {
              this.advance();
            }
          } else {
            unescaped = decodeURIComponent(this.peek);
            this.advance();
          }
          buffer.push(String.fromCharCode(unescaped));
          marker = this.index;
        } else if (this.peek == $EOF) {
          this.error('Unterminated quote');
        } else {
          this.advance();
        }
      }
      var last = this.input.substring(marker, this.index);
      this.advance();
      var text = this.input.substring(start, this.index);
      var unescaped = last;
      if (buffer != null) {
        buffer.push(last);
        unescaped = buffer.join('');
      }
      return assert.returnType((new Token(start, text).withValue(unescaped)), Token);
    },
    advance: function() {
      if (++this.index >= this.length) {
        this.peek = $EOF;
      } else {
        this.peek = this.input.charCodeAt(this.index);
      }
    },
    error: function(message) {
      var offset = arguments[1] !== (void 0) ? arguments[1] : 0;
      assert.argumentTypes(message, $traceurRuntime.type.string, offset, $traceurRuntime.type.number);
      var position = this.index + offset;
      throw new Error(("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]"));
    }
  }, {});
  Scanner.parameters = [[$traceurRuntime.type.string]];
  Scanner.prototype.scanCharacter.parameters = [[$traceurRuntime.type.number], [$traceurRuntime.type.string]];
  Scanner.prototype.scanOperator.parameters = [[$traceurRuntime.type.number], [$traceurRuntime.type.string]];
  Scanner.prototype.scanComplexOperator.parameters = [[$traceurRuntime.type.number], [$traceurRuntime.type.number], [$traceurRuntime.type.string], [$traceurRuntime.type.string]];
  Scanner.prototype.scanNumber.parameters = [[$traceurRuntime.type.number]];
  Scanner.prototype.error.parameters = [[$traceurRuntime.type.string], [$traceurRuntime.type.number]];
  var OPERATORS = ['undefined', 'null', 'true', 'false', '+', '-', '*', '/', '~/', '%', '^', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '&', '|', '!', '?'];
  var $EOF = 0;
  var $TAB = 9;
  var $LF = 10;
  var $VTAB = 11;
  var $FF = 12;
  var $CR = 13;
  var $SPACE = 32;
  var $BANG = 33;
  var $DQ = 34;
  var $$ = 36;
  var $PERCENT = 37;
  var $AMPERSAND = 38;
  var $SQ = 39;
  var $LPAREN = 40;
  var $RPAREN = 41;
  var $STAR = 42;
  var $PLUS = 43;
  var $COMMA = 44;
  var $MINUS = 45;
  var $PERIOD = 46;
  var $SLASH = 47;
  var $COLON = 58;
  var $SEMICOLON = 59;
  var $LT = 60;
  var $EQ = 61;
  var $GT = 62;
  var $QUESTION = 63;
  var $0 = 48;
  var $9 = 57;
  var $A = 65;
  var $E = 69;
  var $Z = 90;
  var $LBRACKET = 91;
  var $BACKSLASH = 92;
  var $RBRACKET = 93;
  var $CARET = 94;
  var $_ = 95;
  var $a = 97;
  var $e = 101;
  var $f = 102;
  var $n = 110;
  var $r = 114;
  var $t = 116;
  var $u = 117;
  var $v = 118;
  var $z = 122;
  var $LBRACE = 123;
  var $BAR = 124;
  var $RBRACE = 125;
  var $TILDE = 126;
  var $NBSP = 160;
  function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
  }
  function isIdentifierStart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || (code == $_) || (code == $$);
  }
  function isIdentifierPart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || ($0 <= code && code <= $9) || (code == $_) || (code == $$);
  }
  function isDigit(code) {
    return ($0 <= code && code <= $9);
  }
  function isExponentStart(code) {
    return (code == $e || code == $E);
  }
  function isExponentSign(code) {
    return (code == $MINUS || code == $PLUS);
  }
  function unescape(code) {
    switch (code) {
      case $n:
        return $LF;
      case $f:
        return $FF;
      case $r:
        return $CR;
      case $t:
        return $TAB;
      case $v:
        return $VTAB;
      default:
        return code;
    }
  }
  function assert(condition, message) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  }
  return {
    get Token() {
      return Token;
    },
    get ArrayOfToken() {
      return ArrayOfToken;
    },
    get Lexer() {
      return Lexer;
    },
    get Scanner() {
      return Scanner;
    },
    __esModule: true
  };
});
