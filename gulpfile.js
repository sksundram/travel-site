// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const cssvars = require('postcss-simple-vars');
const nested = require('postcss-nested');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// File path variables
const files = {
  cssPath: './app/assets/styles/**/*.css',
  htmlPath: './app/*.html'
};

// CSS task
function cssTask() {
  return src(files.cssPath)
    .pipe(sourcemaps.init())
    .pipe(postcss([cssvars, nested, autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/temp/styles'))
    .pipe(browserSync.stream());
}

// Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask() {
  return src(['./app/index.html'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('./app'));
}

// Watch task
function watchTask() {
  browserSync.init({
    server: {
      baseDir: './app'
    },
    notify: false,
    open: false
  });

  watch(files.cssPath, cssTask);
  watch(files.htmlPath).on('change', browserSync.reload);
}

// Default task
exports.default = series(cssTask, cacheBustTask, watchTask);
