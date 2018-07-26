var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var rollup = require('rollup');
var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

// Copy third party css from /node_modules into /vendor
gulp.task('vendor:css', function() {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/{css,css/*}',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./dist/vendor/bootstrap'));

  // Font Awesome
  gulp.src([
      './node_modules/font-awesome/**/*',
      '!./node_modules/font-awesome/{less,less/*}',
      '!./node_modules/font-awesome/{scss,scss/*}',
      '!./node_modules/font-awesome/.*',
      '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('./dist/vendor/font-awesome'));

  // Magnific Popup
  gulp.src([
      './node_modules/magnific-popup/dist/*.css'
    ])
    .pipe(gulp.dest('./dist/vendor/magnific-popup'));

});

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
gulp.task('default', ['html', 'css', 'js', 'images', 'vendor:css']);

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
