var gulp = require('gulp');
var rename = require('gulp-rename');
var $    = require('gulp-load-plugins')();
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(livereload())
    .pipe(gulp.dest('public/css'));
});

gulp.task('build', function(){
  gulp.src('./bower_components/async/dist/async.min.js')
  .pipe(gulp.dest('./public/js/vendor'));
  gulp.src('./bower_components/foundation-sites/dist/foundation.min.js')
  .pipe(gulp.dest('./public/js/vendor'));
  gulp.src('./bower_components/jquery/dist/jquery.min.js')
  .pipe(gulp.dest('./public/js/vendor'));
});

var webBuildFiles = [
  './**/*.*'
];


gulp.task('default', ['sass'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
});
