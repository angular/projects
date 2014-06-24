require.config({
  paths: {
    'libPath': 'lib',
    'directivesPath': 'directives',
    'servicesPath': 'services',
    'route-recognizer':'lib/route-recognizer.amd'
  },
  map: {
    '*': {
      'templating': 'libPath/templating/index',
      'di': 'libPath/di/index',
      'rtts-assert': 'libPath/rtts-assert/assert',
      'expressionist': 'libPath/expressionist/index',
      'watchtower': 'libPath/watchtower/index',
      'router': 'libPath/router/index',
      'directives': 'directivesPath/index',
      'routes/directives': 'directivesPath/index',
      'services': 'servicesPath/index'
    }
  },
  deps: ['templating']
});