/// <binding BeforeBuild='default' />

"use strict";

var _ = require('lodash'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename');

var paths = {
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";

paths.angularJs = [
    './node_modules/angular2/bundles/angular2.dev.js',
    './node_modules/angular2/bundles/router.dev.js',
    './node_modules/angular2/bundles/angular2-polyfills.js',
    './node_modules/angular2/bundles/http.dev.js'
];

paths.libJs = [
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './node_modules/systemjs/dist/system.js',
    './node_modules/rxjs/bundles/Rx.js',
    './node_modules/typescript/lib/typescript.js',
    './node_modules/jquery/dist/jquery.js'
];

paths.libCss = [
    './node_modules/bootstrap/dist/css/bootstrap.css'
];

paths.libFonts = [
    './node_modules/bootstrap/dist/fonts/*.*'
];

paths.jsDest = paths.webroot + "js";
paths.angularJsDest = paths.jsDest + "/angular2";
paths.cssDest = paths.webroot + "css";
paths.fontDest = paths.webroot + "fonts";

gulp.task('copy-js', function () {
    _.forEach(paths.libJs, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest(paths.jsDest))
    });
    _.forEach(paths.angularJs, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest(paths.angularJsDest))
    });
});

gulp.task('copy-css', function () {
    _.forEach(paths.libCss, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest(paths.cssDest))
    });
    _.forEach(paths.libFonts, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest(paths.fontDest))
    });
});

gulp.task('min-js', function () {
    gulp.src([paths.js, "!" + paths.minJs], { base: paths.jsDest })
         .pipe(uglify())
         .pipe(rename({ extname: '.min.js' }))
         .pipe(gulp.dest(paths.jsDest));
});

gulp.task('min-css', function () {
    gulp.src([paths.css, "!" + paths.minCss], { base: paths.cssDest })
		.pipe(cssmin())
        .pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest(paths.cssDest));
});

gulp.task('default', ['copy-js', 'copy-css']);
gulp.task('minify', ['min-js', 'min-css']);