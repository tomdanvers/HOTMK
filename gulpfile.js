/**
 * Gulpfile
 */

'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');

var browserify = require('browserify');
var babelify = require('babelify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var size = require('gulp-filesize');
var cssmin = require('gulp-cssmin');

var fs = require('fs');

gulp.task('connect', function() {

    connect.server({
        root: './www',
        port: 8000,
        livereload: true
    });

});

gulp.task('scripts', function() {

    // gulp.src('./src/js/main.js')
    //     .pipe(plumber())
    //     .pipe(browserify())
    //     .pipe(concat('prod.js'))
    //     .pipe(size())
    //     .pipe(gulp.dest('./www/js/'))
    //     .pipe(uglify())
    //     .pipe(concat('prod.min.js'))
    //     .pipe(size())
    //     .pipe(gulp.dest('./www/js/'))
    //     .pipe(connect.reload());


    var bundler = browserify('./src/js/main.js');
    bundler.transform(babelify, {presets: ['es2015']});

    bundler.bundle()
        .on('error', function (err) { console.error(err); })
        .pipe(source('app.js'))
        .pipe(buffer())
        // .pipe(uglify()) // Use any gulp plugins you want now
        .pipe(gulp.dest('./www/js/'))
        .pipe(connect.reload());

});

gulp.task('styles', function() {

    gulp.src('./src/scss/**/**.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(cssmin())
        .pipe(size())
        .pipe(gulp.dest('./www/css/'))
        .pipe(connect.reload());

});

gulp.task('watch', ['scripts', 'styles'], function() {

    gulp.watch([ './src/js/**/**.js', './src/js/**/**.json', './www/index.html'], ['scripts']);
    gulp.watch('./src/scss/**/**.scss', ['styles']);

});

gulp.task('default', ['watch', 'connect']);
