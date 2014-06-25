define([], function() {
  "use strict";
  var __moduleName = "http";
  function Http() {
    return function(url) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            resolve(JSON.parse(xhr.responseText));
          }
        };
        xhr.send();
      });
    };
  }
  return {
    get Http() {
      return Http;
    },
    __esModule: true
  };
});
