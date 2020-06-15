'use strict';
const gulp = require('gulp');
const {series, parallel, src, dest, watch} = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const prefixer = require('gulp-autoprefixer');
const rigger = require('gulp-rigger');
const rename = require("gulp-rename");
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');


function html() {
    return src('./src/*.html')
        .pipe(rigger())
        .pipe(dest('./build/'))
        .pipe(reload({stream: true}))
}

function less_translator() {
    return src('./src/less/main.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(prefixer({
            cascade: false
        }))
        .pipe(dest('./build/css'))
        .pipe(reload({stream: true}))
}

function img() {
    return src('./src/img/**/*')
        .pipe(dest('./build/img'))
}

function fonts() {
    return src('./src/fonts/**/*')
        .pipe(dest('./build/fonts'))
}

function libs() {
    return src('./src/libs/**/*')
        .pipe(dest('./build/libs'))
}

function js() {
    return src('./src/js/**/*')
        .pipe(dest('./build/js'))
        .pipe(reload({stream: true}))
}
function php() {
    return src('./src/php/**/*')
        .pipe(dest('./build/php'))
}


const config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "jf"
};

function webServer(cb) {
    browserSync(config);
    cb();
}

function watchAll(cb) {
    watch('./src/*.html', html);
    watch('./src/blocks/*.html', html);
    watch('./src/less/*.less', less_translator);
    watch('./src/img/**/*', img);
    watch('./src/fonts/**/*', fonts);
    watch('./src/libs/**/*', libs);
    watch('./src/js/**/*', js);
    watch('./src/php/**/*', php);
    cb();
}

exports.default = parallel(webServer, watchAll);