const gulp = require('gulp');
const minifyJS = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
gulp.task('js', function () {
    gulp.src('./src/**/*.js').pipe(minifyJS({
        ext: {
            min: '.js'
        },
        noSource: true
    })).pipe(gulp.dest('./min/'));
});
gulp.task('css', function () {
    gulp.src('./src/**/*.css').pipe(cleanCSS({
        compatibility: '*'
    })).pipe(gulp.dest('./min/'));
});
gulp.task('build', ['css', 'js']);
gulp.task('clean', function () {
    del('./src/', {
        force: true
    });
});