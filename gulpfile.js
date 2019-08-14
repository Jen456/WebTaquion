
// Modules & Plugins
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var imagemin = require("gulp-imagemin"); 
var changedInPlace = require('gulp-changed-in-place');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
const browsersync = require('browser-sync').create();

// Definimos paths del archivo original
var paths = {
  base:   {
    base:         {
      dir:    './'
    },
    node:         {
      dir:    './node_modules'
    },
    packageLock:  {
      files:  './package-lock.json'
    }
  },
  dist:   {
    base:   {
      dir:    './dist/'
    },
    libs:   {
      dir:    './dist/assets/libs'
    },
    files:   {
      dir:    './dist/**'
    }
    
  },
  src:    {
    base:   {
      dir:    './src/',
      files:  './src/**/*'
    },
    css:    {
      dir:    './src/assets/css',
      files:  './src/assets/css/**/*'
    },
    html:   {
      dir:    './src',
      files:  './src/**/*',
    },
    img:    {
      dir:    './src/assets/img',
      files:  './src/assets/img/**/*',
    },
    js:     {
      dir:    './src/assets/js',
      files:  './src/assets/js/**/*'
    },
    partials:   {
      dir:    './src/partials/',
      files:  './src/partials/**/*'
    },
    scss:   {
      dir:    './src/assets/scss',
      files:  './src/assets/scss/**/*',
      main:   './src/assets/scss/*.scss'
    },
    tmp:    {
      dir:    './src/.tmp',
      files:  './src/.tmp/**/*'
    }
  }
};
gulp.copy=function(paths,dist){
  return gulp.src(src, {base:"."})
      .pipe(gulp.dest(dist));
};

gulp.task('index', function () {
  var target = gulp.src('src/assets/**/*');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./src/**/*.js', './src/**/*.css', './src/**/*.svg', './src/**/*.png', './src/**/*.woff', './src/**/*.woff2'], {read: false});

  return target.pipe(inject(sources))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

// imagenes 
gulp.task("png", function() {
  return gulp.src(['src/assets/img/**/*.png'], {base: 'assets'})
    .pipe(imagemin())
    .pipe(changedInPlace())
    .pipe(gulp.dest("dist/img"));
});

// Styles Task
gulp.task('styles', function() {
  return gulp.src('src/assets/**/*.css')

      .pipe(gulp.dest('dist'));
});

// Scripts Task
gulp.task('scripts', function() {
  return gulp.src('src/assets/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
      
});

gulp.task('svg', function() {
  return gulp.src('src/assets/**/*.svg')
      .pipe(gulp.dest('dist/svg'));
});

gulp.task('scss', function() {
  return gulp.src('src/assets/**/*.scss')
      .pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
      .pipe(gulp.dest('dist'));
});


// Watch Task
gulp.task('watch', function() {
  gulp.watch('src/**/*.svg', gulp.series('svg'));
  gulp.watch('src/**/*.html', gulp.series('html'));
  gulp.watch('*.scss', gulp.series('scss'));
  gulp.watch('img/*.png', gulp.series('png'));
});

// Default Task
gulp.task('default', gulp.series(gulp.parallel('styles', 'png','html','scripts','svg', 'scss', 'watch')));