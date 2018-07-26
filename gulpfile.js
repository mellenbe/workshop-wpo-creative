var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');


// Minify JavaScript
gulp.task('js:minify', function() {
    return gulp.src([
        './dist/js/*.js',
        '!./dist/js/*.min.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('js:concat', function() {
    return gulp.src([
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/jquery.easing/jquery.easing.min.js',
        './node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
        './node_modules/scrollreveal/dist/scrollreveal.min.js',
        './dist/js/creative.min.js'
    ])
        .pipe(concat('all-scripts.min.js'))
        .pipe(gulp.dest('./dist/js'));
});

// JS
gulp.task('js', ['js:minify', 'js:concat']);

gulp.task('html', function() {
  return gulp.src('./index.html')
    .pipe(gulp.dest('./dist'))
});

gulp.task('images', function() {
  return gulp.src('./img/**/*')
  .pipe(gulp.dest('dist/img'))
});
gulp.task('fonts', function() {
  return gulp.src('./fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});


// Compile SCSS
gulp.task('css', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))

    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});


// CSS
//gulp.task('css', ['css:minify','css:compile']);

// Default task
gulp.task('default', ['html', 'css', 'js', 'images', 'fonts']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    startPath: "/dist",
      server: {
        baseDir: '.'
      }
  });
});

// Dev task
gulp.task('dev', ['browserSync', 'css', 'js', 'html', 'images'], function() {
  gulp.watch('./scss/**/*.scss', ['css', browserSync.reload]);
  gulp.watch('./js/*.js', ['js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('./*.html', ['html', browserSync.reload]);
});
