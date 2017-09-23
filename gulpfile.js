var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var babelify = require('babelify');
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var clean = require('gulp-clean');

// Set the banner content
var banner = ['/*!\n',
  ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * <%= pkg.description %> \n',
  ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (<%= pkg.homepage %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

//Clean css file from dist
gulp.task('clean:style', function() {
  return gulp.src('dist/*.css', {read: false})
    .pipe(clean());
})

// Compiles SCSS files from /scss into /dist
gulp.task('sass', ['clean:style'], function() {
  return gulp.src('scss/cnso.scss')
    .pipe(sass())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
  return gulp.src('dist/cnso.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//Clean js file from dist
gulp.task('clean:script', function() {
  return gulp.src('dist/*.js', {read: false})
    .pipe(clean());
})

// Build js file from ES6 to /dist
gulp.task('babel', ['clean:script'], function() {
  return browserify({
        entries: ["./js/main.js"]
    })
    .transform(babelify.configure({
        presets : ["es2015"]
    }))
    .bundle()
    .pipe(source("cnso.js"))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./dist"))
})

// Minify custom JS
gulp.task('minify-js', ['babel'], function() {
  return gulp.src('dist/cnso.js')
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task('copy', function() {

  gulp.src(['node_modules/konva/konva.js', 'node_modules/konva/konva.min.js'])
    .pipe(gulp.dest('vendor/konva'))

})

// Default task
gulp.task('default', ['sass', 'babel', 'minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: ['demo/', 'dist/', 'vendor/']
  })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'babel', 'minify-css', 'minify-js'], function() {
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('css/*.css', ['minify-css']);
  gulp.watch('js/*.js', ['minify-js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('demo/*.html', browserSync.reload);
  gulp.watch('js/**/*.js', browserSync.reload);
});
