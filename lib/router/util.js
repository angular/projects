define([], function() {
  "use strict";
  var __moduleName = "util";
  function extend(obj) {
    var rest = Array.prototype.slice.call(arguments, 1);
    for (var i = 0,
        length = rest.length; i < length; i++) {
      var source = rest[i];
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }
  function getWildCardName(pattern) {
    var wildcardIndex = pattern.lastIndexOf('*');
    return pattern.substr(wildcardIndex + 1);
  }
  function getWildcardPath(pattern, params, qs) {
    var wildcardName = getWildCardName(pattern),
        path = params[wildcardName];
    if (qs) {
      path += "?" + qs;
    }
    return path;
  }
  function processPotential(obj, resolve, reject) {
    if (obj && typeof obj.then === 'function') {
      var dfd = obj.then(resolve);
      if (typeof dfd.catch === 'function') {
        return dfd.catch(reject);
      } else if (typeof dfd.fail === 'function') {
        return dfd.fail(reject);
      }
      return dfd;
    } else {
      try {
        return resolve(obj);
      } catch (error) {
        return reject(error);
      }
    }
  }
  return {
    get extend() {
      return extend;
    },
    get getWildCardName() {
      return getWildCardName;
    },
    get getWildcardPath() {
      return getWildcardPath;
    },
    get processPotential() {
      return processPotential;
    },
    __esModule: true
  };
});
