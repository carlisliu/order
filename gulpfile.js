var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
//var pkg = require('./package');


gulp.task('default', function () {
    /*gulp.src('src/src.js')
     .pipe(uglify())
     .pipe(gulp.dest('dist/'));*/


});

gulp.task('minify-css', function () {
    return gulp.src('public/stylesheets/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/dist'));
});