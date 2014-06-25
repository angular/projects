exports.config = {
  baseUrl: 'http://localhost:8000',
  framework: 'jasmine',

  specs: [
    'dist_test/**/*.spec.js',
  ],

  onPrepare: function() {
    // Disable waiting for Angular as we don't have an integration layer yet...
    // TODO: Implement a proper debugging API for ng2.0, remove this here
    // and the sleeps in all tests.
    browser.ignoreSynchronization = true;
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    showColors: false,
    includeStackTrace: true,
    isVerbose: true
  }
};