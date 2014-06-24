var gulp = require('gulp');
var pipe = require('pipe/gulp');
var connect = require('gulp-connect');
var traceur = require('gulp-traceur');
var through = require('through2');

var path = {
  src: ['./src/**/*.js', '!./src/**/*.inline.js'],
  srcInline: ['./src/**/*.inline.js'],
  srcCopy: ['./src/**/*.html', './src/**/*.css'],
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
  output: 'dist'
};

gulp.task('build_source', function() {
  gulp.src(path.src)
      .pipe(traceur(pipe.traceur()))
      .pipe(gulp.dest(path.output));
  gulp.src(path.srcInline)
      .pipe(traceur(pipe.traceur({modules: 'inline'})))
      .pipe(gulp.dest(path.output));
  gulp.src(path.srcCopy)
      .pipe(gulp.dest(path.output));
});

gulp.task('build_deps', function() {
  for (var prop in path.deps) {
    gulp.src(path.deps[prop])
        .pipe(traceur(pipe.traceur()))
        .pipe(gulp.dest(path.output+'/lib/' + prop));
  }
  gulp.src(path.depsCopy)
        .pipe(gulp.dest(path.output+'/lib/'));
});

gulp.task('build', ['build_source', 'build_deps']);


// WATCH FILES FOR CHANGES
gulp.task('watch', function() {
  gulp.watch([path.src, path.srcInline, path.srcCopy], ['build_source']);
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

