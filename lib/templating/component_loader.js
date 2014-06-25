define(['./util/annotation_provider', './annotations', 'di', './compiler/compiler', './load_barrier'], function($__0,$__1,$__2,$__3,$__4) {
  "use strict";
  var __moduleName = "component_loader";
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
  var AnnotationProvider = $traceurRuntime.assertObject($__0).AnnotationProvider;
  var $__8 = $traceurRuntime.assertObject($__1),
      Directive = $__8.Directive,
      ComponentDirective = $__8.ComponentDirective;
  var $__8 = $traceurRuntime.assertObject($__2),
      Inject = $__8.Inject,
      Provide = $__8.Provide,
      Injector = $__8.Injector;
  var Compiler = $traceurRuntime.assertObject($__3).Compiler;
  var loadBarrier = $traceurRuntime.assertObject($__4).loadBarrier;
  var ComponentLoader = function ComponentLoader(annotationProvider, injector) {
    this.annotationProvider = annotationProvider;
    this.injector = injector;
    this._templateCache = new Map();
    this._directiveCache = {};
    this._templateUrlCache = {};
  };
  ($traceurRuntime.createClass)(ComponentLoader, {
    getDirectiveForElementName: function(elementName) {
      return this._directiveCache[elementName.toLowerCase()];
    },
    getTemplateForDirective: function(directive) {
      return this._templateCache.get(directive);
    },
    loadFromElement: function(element, done) {
      var $__5 = this;
      var $__8 = $traceurRuntime.assertObject(this._getDirectiveSelector(element)),
          directiveModuleId = $__8.directiveModuleId,
          selectDirective = $__8.selectDirective,
          elementBaseUrl = $__8.elementBaseUrl;
      var configModuleIds = (element.getAttribute('ng-config') || '').split(/\s*,\s*/);
      configModuleIds.push(directiveModuleId);
      configModuleIds = configModuleIds.map((function(moduleId) {
        if (!moduleId.match(/.*\/\/.*/)) {
          moduleId = elementBaseUrl + moduleId;
        }
        moduleId = $__5._getRelativeUrl(moduleId, document.location.href.replace(/#.*/, ''));
        if (moduleId === '') {
          moduleId = 'index.js';
        }
        return moduleId;
      }));
      var loadDone = loadBarrier(done);
      require(configModuleIds, (function() {
        for (var modules = [],
            $__7 = 0; $__7 < arguments.length; $__7++)
          modules[$__7] = arguments[$__7];
        var componentModule = modules.pop();
        var directive = selectDirective(componentModule);
        var directiveAnnotation = $__5.annotationProvider(directive, ComponentDirective);
        var existingTemplate = $__5.getTemplateForDirective(directive);
        if (existingTemplate) {
          loadDone({
            elementName: directiveAnnotation.selector,
            args: [{
              elementName: directiveAnnotation.selector,
              directive: directive,
              template: existingTemplate
            }]
          });
          return;
        }
        var providers = directiveAnnotation.providers || [];
        var $__8 = $traceurRuntime.assertObject($__5._findDirectivesInModules(modules)),
            directives = $__8.directives,
            usedComponents = $__8.components;
        var compileInjector = $__5.injector.createChild(providers);
        var compiler = compileInjector.get(Compiler);
        var templateContainer = element.content || element;
        var compiledTemplate = compiler.compileChildNodes(templateContainer, directives);
        usedComponents.forEach((function(directive) {
          if (!$__5.getTemplateForDirective(directive)) {
            $__5._loadByDirective(directive);
          }
        }));
        $__5._templateCache.set(directive, compiledTemplate);
        $__5._directiveCache[directiveAnnotation.selector] = directive;
        loadDone({
          elementName: directiveAnnotation.selector,
          args: [{
            elementName: directiveAnnotation.selector,
            directive: directive,
            template: compiledTemplate
          }]
        });
      }));
    },
    loadFromTemplateUrl: function($__8) {
      var templateUrl = $__8.templateUrl,
          templateId = $__8.templateId,
          done = $__8.done;
      var $__5 = this;
      var cacheKey = templateUrl + '#' + templateId;
      var cachedEntry = this._templateUrlCache[cacheKey];
      if (cachedEntry) {
        done(cachedEntry);
        return;
      }
      var loadDone = loadBarrier();
      this._loadElementsByUrl(templateUrl, 'template[ng-config]', (function(elements) {
        if (templateId) {
          elements = elements.filter((function(element) {
            return element.id === templateId;
          }));
        }
        $__5.loadFromElement(elements[0], (function(entry) {
          $__5._templateUrlCache[cacheKey] = entry;
          done(entry);
        }));
      }));
      loadDone();
    },
    _loadByDirective: function(componentDirective) {
      var $__5 = this;
      var $__9 = $traceurRuntime.assertObject(this._getTemplateSelector(componentDirective)),
          templateUrl = $__9.templateUrl,
          selectTemplate = $__9.selectTemplate;
      var loadDone = loadBarrier();
      this._loadElementsByUrl(templateUrl, 'template[ng-config]', (function(elements) {
        $__5.loadFromElement(selectTemplate(elements), null);
        loadDone();
      }));
    },
    _getDirectiveSelector: function(element) {
      var self = this;
      var elementId = element.getAttribute('id');
      var elementUrl = this._getElementUrl(element);
      var elementBaseUrl = elementUrl.replace(/(.*\/)[^\/]*/, '$1');
      var directiveModuleId = elementUrl.replace(/.html$/, '');
      return {
        directiveModuleId: directiveModuleId,
        elementBaseUrl: elementBaseUrl,
        selectDirective: select
      };
      function select(module) {
        if (elementId) {
          return module[elementId];
        }
        var components = $traceurRuntime.assertObject(self._findDirectivesInModules([module])).components;
        if (components.length > 0) {
          return components[0];
        }
        throw new Error('Could not find the directive for template at url ' + elementUrl);
      }
    },
    _getTemplateSelector: function(directive) {
      var annotation = this.annotationProvider(directive, Directive);
      var templateUrl = annotation.moduleId + '.html';
      var className = directive.constructor.name;
      return {
        templateUrl: templateUrl,
        selectTemplate: select
      };
      function select(elements) {
        var idResult,
            noIdResult;
        elements.forEach((function(element) {
          if (!element.id) {
            noIdResult = element;
          }
          if (element.id === className) {
            idResult = element;
          }
        }));
        return idResult ? idResult : noIdResult;
      }
    },
    _findDirectivesInModules: function(modules) {
      var $__5 = this;
      var directives = [];
      var components = [];
      modules.forEach((function(module) {
        var exportValue;
        for (var exportName in module) {
          exportValue = module[exportName];
          if (typeof exportValue === 'function') {
            var directiveAnnotation = $__5.annotationProvider(exportValue, Directive);
            if (directiveAnnotation) {
              directives.push(exportValue);
            }
            if (directiveAnnotation instanceof ComponentDirective) {
              components.push(exportValue);
            }
          }
        }
      }));
      return {
        directives: directives,
        components: components
      };
    },
    _getElementUrl: function(element) {
      var url = element.getAttribute('assetpath');
      if (!url) {
        var doc = element.ownerDocument;
        var a = doc.createElement('a');
        a.href = '';
        return a.href;
      }
      return url;
    },
    _loadElementsByUrl: function(url, selector, done) {
      var templateElements = document.querySelectorAll(selector + ("[assetpath=\"" + url + "\"]"));
      var promise;
      if (templateElements.length) {
        done(Array.prototype.slice.call(templateElements));
      } else {
        this._importDocument(url, (function(doc) {
          done(Array.prototype.slice.call(doc.querySelectorAll(selector)));
        }));
      }
    },
    _importDocument: function(url, done) {
      var link = document.createElement('link');
      link.rel = 'import';
      link.href = url;
      link.addEventListener('load', (function() {
        done(link.import);
        link.remove();
      }), false);
      document.body.appendChild(link);
    },
    _getRelativeUrl: function(src, base) {
      var srcSlashParts = src.split('/');
      var baseSlashParts = base.split('/');
      var res = [];
      for (var i = 0; i < Math.min(srcSlashParts.length, baseSlashParts.length); i++) {
        var srcPart = srcSlashParts[i];
        var basePart = baseSlashParts[i];
        if (srcPart !== basePart) {
          break;
        }
      }
      var count = baseSlashParts.length - i - 1;
      while (count > 0) {
        res.push('..');
        count--;
      }
      while (i < srcSlashParts.length) {
        res.push(srcSlashParts[i]);
        i++;
      }
      return res.join('/');
    }
  }, {});
  ComponentLoader.annotations = [new Inject(AnnotationProvider, Injector)];
  return {
    get ComponentLoader() {
      return ComponentLoader;
    },
    __esModule: true
  };
});
