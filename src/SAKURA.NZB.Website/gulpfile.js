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

paths.js = paths.webroot + "/js/**/*.js";
paths.minJs = paths.webroot + "/js/**/*.min.js";
paths.css = paths.webroot + "/css/**/*.css";
paths.minCss = paths.webroot + "/css/**/*.min.css";

paths.lib = [
    './node_modules/angular2/bundles/**/*.*',
    './node_modules/bootstrap/dist/**/*.*',
    './node_modules/systemjs/dist/**/*.*',
    './node_modules/rxjs/bundles/**/*.*',
    './node_modules/typescript/lib/**/*.*',
    './node_modules/jquery/dist/**/*.*',
    './node_modules/d3/*.*',
    './node_modules/moment/min/**/*.*',
    './node_modules/clipboard/dist/**/*.*',
    './node_modules/ng2-bootstrap/bundles/**/*.*',
    './node_modules/chart.js/dist/**/*.*',
    './node_modules/ng2-charts/bundles/**/*.*'
];

paths.jsDest = paths.webroot + "js";
paths.cssDest = paths.webroot + "css";
paths.fontDest = paths.webroot + "fonts";

gulp.task('copy-lib', function () {
    _.forEach(paths.lib, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest(function (file) {
                var dest = file.base.replace('node_modules', 'wwwroot\\lib');
                return dest;
            }));
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

gulp.task('default', ['copy-lib']);
gulp.task('minify', ['min-js', 'min-css']);