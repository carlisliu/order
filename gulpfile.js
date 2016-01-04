var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

gulp.task('css', function() {
    gulp.src(['public/stylesheets/bootstrap.css', 'public/stylesheets/bootstrap-responsive.css',
            'jquery.fancybox.css', 'public/stylesheets/style.css', 'public/stylesheets/jquery.jgrowl.css'
        ])
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(concat('all.css'))
        .pipe(gulp.dest('public/dist/stylesheets'));
});

gulp.task('css-datepicker', function() {
    gulp.src('public/stylesheets/datepicker.css')
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(concat('datepicker.css'))
        .pipe(gulp.dest('public/dist/stylesheets'));
});

gulp.task('css-login', function() {
    gulp.src('public/stylesheets/login/*.css')
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(concat('login.all.css'))
        .pipe(gulp.dest('public/dist/stylesheets/login')).on('task_err', function(err) {
            console.log(err);
        }).on('error', function(err) {
            console.log(err);
        });
});

gulp.task('clean-css-login', function() {
    gulp.src('public/dist/stylesheets/login')
        .pipe(clean()).on('task_err', function(err) {
            console.log(err);
        }).on('error', function(err) {
            console.log(err);
        });
});

gulp.task('clean-css', function() {
    gulp.src('public/dist/stylesheets/*')
        .pipe(clean());
});

gulp.task('clean-static', function() {
    gulp.src(['public/dist/javascripts/static/*'])
        .pipe(clean());
});

gulp.task('clean-modules', function() {
    gulp.src(['public/dist/javascripts/sea-modules/bootstrap/*'])
        .pipe(clean());
});

gulp.task('script-static', ['clean-static'], function() {
    gulp.src('public/javascripts/static/**/*.js')
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/javascripts/static'));
});

gulp.task('script-modules', function() {
    gulp.src(['public/javascripts/sea-modules/**/**/*.js',
            '!public/javascripts/sea-modules/backstretch/**/*.js',
            '!public/javascripts/sea-modules/seajs/**/*.js',
            'public/javascripts/sea-modules/**/**/**/*.js',
            '!public/javascripts/sea-modules/jquery/jquery/**/*.js'
        ])
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/javascripts/sea-modules/')).on('error', function(error) {
            console.log(error);
        });

});

gulp.task('default', ['script-static', 'script-modules', 'css', 'css-login', 'css-datepicker']);