'use strict';

// dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var del = require('del');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

// clear temp files
gulp.task('clear', function () {
    return del([
        'web/assets/temp',
    ]);
});

// Scripts (ES6)
gulp.task('babelify', function () {
    let bundler = browserify('./src/AppBundle/Resources/public/js/main.js', {debug: true}).transform(babelify);

    bundler.bundle()
        .on('error', function (err) {
            console.error(err);
            this.emit('end');
        })
        .pipe(source('app.js')) //fichier de destination
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('web/assets/js'));
});

gulp.task('lib', function () {
    return gulp.src('./src/AppBundle/Resources/public/js/lib/*.js')
        .pipe(gulp.dest('./web/assets/js/lib'));
});

// Style (sass)
gulp.task('sass', ['clear'], function () {
    return gulp.src('./src/AppBundle/Resources/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./web/assets/temp'));
});

gulp.task('concat-css', ['sass'], function () {
    return gulp.src('./web/assets/temp/**/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./web/assets/css'))
});

// Images
gulp.task('images', function () {
    return gulp.src('./src/AppBundle/Resources/public/images/**/*.jpg')
        .pipe(gulp.dest('./web/assets/images'));

});

// Watches
gulp.task('watch', function () {
    gulp.watch('./src/AppBundle/Resources/**/*.js', ['babelify']);
    gulp.watch('./src/AppBundle/Resources/public/js/lib/*.js', ['lib']);
    gulp.watch('./src/AppBundle/Resources/**/*.scss', ['concat-css']);
    gulp.watch('./src/AppBundle/Resources/**/*.jpg', ['images']);
});

// Default
gulp.task('default', ['deploy', 'watch']);

// Deploy only (without watch task)
gulp.task('deploy', ['babelify', 'lib', 'concat-css', 'images']);
