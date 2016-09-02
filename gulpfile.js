'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var del = require('del');

// clear temp files
gulp.task('clear', function(){
    return del([
        'web/assets/temp',
    ]);
});

// Scripts
gulp.task('js', function () {
    return gulp.src('./src/AppBundle/Resources/public/js/**/*.js')
        .pipe(gulp.dest('./web/assets/js'));

});

// Style
gulp.task('sass', ['clear'], function () {
    return gulp.src('./src/AppBundle/Resources/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./web/assets/temp'));
});

gulp.task('concat-css', ['sass'], function (){
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
    gulp.watch('./src/AppBundle/Resources/**/*.js', ['js']);
    gulp.watch('./src/AppBundle/Resources/**/*.scss', ['concat-css']);
});

// Default
gulp.task('default', ['js', 'concat-css', 'images', 'watch']);

// Deploy only (without watch task)
gulp.task('deploy', ['js', 'concat-css', 'images']);
