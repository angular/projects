var gulp = require('gulp');
var pipe = require('pipe/gulp');
var connect = require('gulp-connect');
var traceur = require('gulp-traceur');
var through = require('through2');
var ConfigParser = require('protractor/lib/configParser');
var Runner = require('protractor/lib/runner');
var map = require('map-stream');
var noop = function() {};

var path = {
  src: ['./src/**/*.js'],
  srcCopy: ['./src/**/*.html', './src/**/*.css'],
  test: ['./test/**/*.js'],
  deps: {
    'watchtower': './node_modules/watchtower/src/**/*.js',
    'expressionist': './node_modules/expressionist/src/**/*.js',
    'di': './node_modules/di/src/**/*.js',
    'rtts-assert': './node_modules/rtts-assert/src/**/*.js',
    'templating': './node_modules/templating/src/**/*.js',
    'router': './node_modules/router/src/**/*.js'
  },
  depsCopy: [
    './bower_components/platform/platform.js',
    './node_modules/es6-shim/es6-shim.js',
    './node_modules/zone.js/zone.js',
    './node_modules/traceur/bin/traceur-runtime.js',
    './node_modules/requirejs/require.js',
    './node_modules/route-recognizer/dist/route-recognizer.amd.js',
    './bower_components/bootstrap/dist/css/bootstrap.min.css',
    './bower_components/font-awesome/css/font-awesome.min.css'
  ],
  output: 'dist',
  outputTest: 'dist_test'
};

gulp.task('build_source', function() {
  gulp.src(path.src)
      .pipe(traceur(pipe.traceur()))
      .pipe(gulp.dest(path.output))
      .pipe(map(noop));
  gulp.src(path.srcCopy)
      .pipe(gulp.dest(path.output))
      .pipe(map(noop));
});

gulp.task('build_test', function() {
  gulp.src(path.test)
      .pipe(traceur(pipe.traceur({modules: 'inline', asyncFunctions: true})))
      .pipe(gulp.dest(path.outputTest))
      .pipe(map(noop));
});


gulp.task('build_deps', function() {
  for (var prop in path.deps) {
    gulp.src(path.deps[prop])
        .pipe(traceur(pipe.traceur()))
        .pipe(gulp.dest(path.output+'/lib/' + prop))
        .pipe(map(noop));
  }
  gulp.src(path.depsCopy)
        .pipe(gulp.dest(path.output+'/lib/'))
        .pipe(map(noop));
});

gulp.task('build', ['build_source', 'build_deps', 'build_test']);


// WATCH FILES FOR CHANGES
gulp.task('watch', function() {
  gulp.watch([path.src, path.srcCopy], ['build_source']);
  gulp.watch([path.test], ['build_test']);
  var deps = [];
  for (var prop in path.deps) {
    deps.push(path.deps[prop]);
  }
  gulp.watch([deps], ['build_deps']);
});

// WEB SERVER
gulp.task('serve', connect.server({
  root: [__dirname+'/'+path.output],
  port: 8000,
  livereload: false,
  open: false
}));

gulp.task('e2e', ['serve'], function() {
  var configParser = new ConfigParser();
  configParser.addFileConfig('protractor.conf.js');
  var config = configParser.getConfig();
  config.specs = ['dist_test/**/*.js'];
  var runner = new Runner(config);
  runner.run().then(function(exitCode) {
    // TODO
  }).catch(function(err) {
    // TODO
  });
});
