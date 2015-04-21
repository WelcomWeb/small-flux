var gulp = require('gulp'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	shim = require('browserify-shim'),
	reactify = require('reactify'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps');

gulp.task('browserify', function () {
	return browserify({
			debug: true
		})
		.transform(reactify)
		.transform(shim)
		.add('./www/javascripts/application.js')
		.bundle()
		.pipe(source('application.browserified.js'))
		.pipe(buffer())
		.pipe(gulp.dest('www/build'));
});
gulp.task('js-uglify', function () {
	return browserify({
			debug: false
		})
		.transform(reactify)
		.transform(shim)
		.add('./www/javascripts/application.js')
		.bundle()
		.pipe(source('application.browserified.min.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('www/build'));
});

gulp.task('less', function () {
	gulp.src('./www/stylesheets/default.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./www/build/'));
});
gulp.task('less-build', function () {
	gulp.src('./www/stylesheets/default.less')
		.pipe(less())
		.pipe(rename('default.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./www/build/'));
});

gulp.task('auto', function () {
	gulp.watch('./www/javascripts/**/*.js', ['browserify']);
	gulp.watch('./www/stylesheets/**/*.less', ['less']);
});

gulp.task('default', ['browserify', 'less']);
gulp.task('build', ['js-uglify', 'less-build']);
