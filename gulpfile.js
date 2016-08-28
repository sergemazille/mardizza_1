'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

// Scripts
gulp.task('js', function () {
    return gulp.src('./src/AppBundle/Resources/public/js/**/*.js')
        .pipe(gulp.dest('./web/assets/js'));

});

// Style
gulp.task('sass', function () {
    return gulp.src('./src/AppBundle/Resources/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/AppBundle/Resources/public/css/'));
});

gulp.task('concat-css', ['sass'], function (){
    return gulp.src('./src/AppBundle/Resources/public/css/*.css')
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
    gulp.watch('./src/AppBundle/Resources/js/**/*.js', ['js']);
    gulp.watch('./src/AppBundle/Resources/**/*.scss', ['sass', 'concat-css']);
});

// Default
gulp.task('default', ['js', 'sass', 'concat-css', 'images', 'watch']);

// Deploy only (without watch task)
gulp.task('deploy', ['js', 'sass', 'concat-css', 'images']);
