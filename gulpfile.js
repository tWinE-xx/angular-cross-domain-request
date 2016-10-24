var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    gp_sourcemaps = require('gulp-sourcemaps');

var params = {
    dist: 'dist',
    sources: ['cdr.module.js', 'cdr.service.js', 'cdr.manager.iframe.js', 'cdr.builder.request.js']
}

gulp.task('js-fef', function(){
    return gulp.src(params.sources)
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('cdr.js'))
        .pipe(gulp.dest(params.dist))
        .pipe(gp_rename('cd.min.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest(params.dist));
});

gulp.task('default', ['js-fef'], function(){});