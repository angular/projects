define(['di', './http', './config'], function($__0,$__1,$__2) {
  "use strict";
  var __moduleName = "gh_service";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  if (!$__1 || !$__1.__esModule)
    $__1 = {'default': $__1};
  if (!$__2 || !$__2.__esModule)
    $__2 = {'default': $__2};
  var Inject = $traceurRuntime.assertObject($__0).Inject;
  var Http = $traceurRuntime.assertObject($__1).Http;
  var Config = $traceurRuntime.assertObject($__2).Config;
  var GhService = function GhService(http, config) {
    this.http = http;
    this.config = config.github;
  };
  ($traceurRuntime.createClass)(GhService, {
    _request: function(suffix) {
      return this.http(("https://api.github.com/repos/" + this.config.user + "/" + this.config.repository + "/" + suffix));
    },
    allIssues: function() {
      return this._request('issues');
    },
    issue: function(id) {
      return this._request(("issues/" + id));
    },
    comments: function(issueId) {
      return this._request(("issues/" + issueId + "/comments"));
    },
    events: function(issueId) {
      return this._request(("issues/" + issueId + "/events"));
    }
  }, {});
  GhService.annotations = [new Inject(Http, Config)];
  return {
    get GhService() {
      return GhService;
    },
    __esModule: true
  };
});
