var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pkg = require('./package');


gulp.task('default', function() {
	/*gulp.src('src/src.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));*/
	console.log('default');
});