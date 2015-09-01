var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./stylesheets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./stylesheets/**/*.scss', ['sass']);
});