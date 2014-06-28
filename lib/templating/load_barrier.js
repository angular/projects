define([], function() {
  "use strict";
  var __moduleName = "load_barrier";
  var global = window;
  if (!global.loadBarrier) {
    global.loadBarrier = waitFor;
  }
  ;
  var currentLoadCycle = null;
  waitForInitialLoad();
  function waitForInitialLoad() {
    var initialLoadWait;
    if (document.readyState !== 'complete') {
      initialLoadWait = waitFor();
      document.addEventListener('DOMContentLoaded', domReady, false);
      window.addEventListener('load', domReady, false);
    }
    function domReady() {
      if (domReady.called) {
        return;
      }
      domReady.called = true;
      var imports = [].slice.call(document.querySelectorAll('link[rel="import"]'));
      imports.forEach((function(link) {
        if (!link.import) {
          link.addEventListener('load', waitFor(), false);
        }
      }));
      initialLoadWait();
    }
  }
  function waitFor() {
    var elementName,
        callback;
    if (arguments.length <= 1) {
      callback = arguments[0];
    } else {
      elementName = arguments[0];
      callback = arguments[1];
    }
    var loadCycle = currentLoadCycle;
    if (!loadCycle) {
      loadCycle = currentLoadCycle = {
        entries: [],
        counter: 0
      };
    }
    loadCycle.counter++;
    return done;
    function done() {
      var args = [].slice.call(arguments);
      if (!elementName) {
        if (args[0] && 'elementName' in args[0]) {
          elementName = args[0].elementName;
          args = args[0].args;
        }
      }
      if (elementName) {
        elementName = elementName.toLowerCase();
      }
      loadCycle.entries.push({
        args: args,
        elementName: elementName,
        callback: callback
      });
      loadCycle.counter--;
      if (loadCycle.counter <= 0) {
        finishedLoadCycle(loadCycle);
        currentLoadCycle = null;
      }
    }
  }
  function finishedLoadCycle(cycle) {
    var cycleEntries = cycle.entries;
    var firstElements = {};
    cycleEntries.forEach(function(cycleEntry) {
      if (cycleEntry.elementName) {
        var element = firstElements[cycleEntry.elementName];
        if (!element) {
          element = firstElements[cycleEntry.elementName] = document.querySelector(cycleEntry.elementName);
        }
        cycleEntry.firstElement = element;
      }
    });
    cycleEntries.sort(function(entry1, entry2) {
      if (entry1.firstElement && entry2.firstElement) {
        if (entry1.elementName === entry2.elementName) {
          return 0;
        }
        return entry1.firstElement.compareDocumentPosition(entry2.firstElement) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      } else if (!entry1.firstElement) {
        return -1;
      } else {
        return 1;
      }
    });
    cycleEntries.forEach(function(cycleEntry) {
      if (cycleEntry.callback) {
        cycleEntry.callback.apply(window, cycleEntry.args);
      }
    });
  }
  return {
    get loadBarrier() {
      return waitFor;
    },
    __esModule: true
  };
});
