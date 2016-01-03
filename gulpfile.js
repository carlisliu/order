var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

gulp.task('css', ['clean-css'], function () {
    gulp.src(['public/stylesheets/bootstrap.css', 'public/stylesheets/bootstrap-responsive.css',
            'jquery.fancybox.css', 'public/stylesheets/style.css'])
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('all.css'))
        .pipe(gulp.dest('public/dist/stylesheets'));

    gulp.src('public/stylesheets/login/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('login.all.css'))
        .pipe(gulp.dest('public/dist/stylesheets/login'));
});

gulp.task('clean-css', function () {
    gulp.src('public/dist/stylesheets/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-script', function () {
    gulp.src('public/dist/javascripts/static/*', {read: false})
        .pipe(clean());
});

gulp.task('script', ['clean-script'], function () {
    console.log('process scripts');
});

gulp.task('default', ['script', 'css']);