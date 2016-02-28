var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');

gulp.task('clean', function(cb) {
  return del('dist', cb);
});

gulp.task('build', function() {
  return gulp.src('app/amazin.js')
  .pipe($.sourcemaps.init())
  .pipe($.jspm())
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
