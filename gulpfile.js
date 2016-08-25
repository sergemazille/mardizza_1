'use strict';

var gulp = require('gulp');

gulp.task('js', function () {
    return gulp.src('./src/AppBundle/Resources/public/js/**/*.js')
        .pipe(gulp.dest('./web/assets/js'));

});

gulp.task('sass', function () {
    return gulp.src('./src/AppBundle/Resources/public/sass/**/*.scss')
        .pipe(gulp.dest('./web/assets/css'));

});

gulp.task('images', function () {
    return gulp.src('./src/AppBundle/Resources/public/images/**/*.jpg')
        .pipe(gulp.dest('./web/assets/images'));

});

// Watches
gulp.task('watch', function () {
    gulp.watch('./src/AppBundle/Resources/js/**/*.js', ['js']);
    gulp.watch('./src/AppBundle/Resources/sass/**/*.scss', ['sass']);
});

// Default
gulp.task('default', ['js', 'sass', 'images', 'watch']);

// Deploy only (without watch task)
gulp.task('deploy', ['js', 'sass', 'images']);
