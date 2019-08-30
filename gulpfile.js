//
// Variables ===================================
//

// Load dependencies
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();
const cached = require('gulp-cached');
const cleancss = require('gulp-clean-css');
const del = require('del');
const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const npmdist = require('gulp-npm-dist');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
var rename = require("gulp-rename");

// Define paths
const paths = {
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
      dir:    './dist'
    },
    libs:   {
      dir:    './dist/assets/libs'
    }
  },
  src:    {
    base:   {
      dir:    './src',
      files:  './src/**/*'
    },
    css:    {
      dir:    './src/assets/css',
      files:  './src/assets/**/*.css'
    },
    html:   {
      dir:    'src/**/*',
      files:  './src/**/*.html',
    },
    img:    {
      dir:    './src/assets/img',
      files:  './src/assets/**/*',
    },
    js:     {
      dir:    './src/assets/js',
      files:  './src/assets/**/*',
      main:   './src/assets/**/*.js'
    },
    partials:   {
      dir:    './src/partials',
      files:  './src/partials/**/*.html'
    },
    scss:   {
      dir:    './src/assets/scss',
      files:  './src/assets/**/*',
      main:   './src/assets/**/*.scss'
    },
    svg:   {
      dir:    './src/assets/svg',
      files:  './src/assets/**/*',
      main:   './src/assets/**/*.svg'
    },
    fonts:   {
      dir:    './src/assets/fonts',
      files:  './src/assets/**/*',
    },
    tmp:    {
      dir:    './src/.tmp',
      files:  './src/.tmp/**/*'
    }
  }
};


//
// Tasks ===================================
//

gulp.task('browsersync', function(callback) {
  browsersync.init({
    server: {
      baseDir: [paths.src.tmp.dir, paths.src.base.dir, paths.base.base.dir]
    },
  });
  callback();
});

gulp.task('browsersyncReload', function(callback) {
  browsersync.reload();
  callback();
});

gulp.task('watch', function() {
  gulp.watch(paths.src.scss.files, gulp.series('scss'));
  gulp.watch([paths.src.js.files, paths.src.img.files], gulp.series('browsersyncReload'));
  gulp.watch([paths.src.html.files, paths.src.partials.files], gulp.series('fileinclude', 'browsersyncReload'));
});


gulp.task('scss', function() {
  return gulp
    .src(paths.src.scss.main, {allowEmpty:true})
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dist.base.dir))
    .pipe(browsersync.stream());
});

gulp.task('js', function() {
  return gulp
    .src(paths.src.js.main, {allowEmpty:true})
    .pipe(gulp.dest(paths.dist.base.dir));
});

gulp.task('svg', function() {
  return gulp
    .src(paths.src.svg.main, {allowEmpty:true})
    .pipe(gulp.dest(paths.dist.base.dir));
});

gulp.task('fonts', function() {
  return gulp
    .src(paths.src.fonts.files, {allowEmpty:true})
    .pipe(gulp.dest(paths.dist.base.dir));
});

gulp.task('fileinclude', function(callback) {
  return gulp
    .src([
      paths.src.html.files,
      '!' + paths.src.tmp.files,
      '!' + paths.src.partials.files
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true
    }))
    .pipe(cached())
    .pipe(gulp.dest(paths.src.tmp.dir));
    
});

gulp.task('clean:tmp', function(callback) {
  del.sync(paths.src.tmp.dir);
  callback();
});

gulp.task('clean:packageLock', function(callback) {
  del.sync(paths.base.packageLock.files);
  callback();
});

gulp.task('clean:dist', function(callback) {
  del.sync(paths.dist.base.dir);
  callback();
});



gulp.task('html', function(callback) {
  return gulp
    .src(
      paths.src.html.files,
      '!' + paths.src.tmp.files,
      '!' + paths.src.partials.files,
     )
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true
    }))
    .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1..'))
    .pipe(replace(/src="(.{0,10})assets/g, 'src="$1..'))
    .pipe(cached())
    

    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cleancss()))
    
    .pipe(gulp.dest(paths.dist.base.dir));
});




gulp.task('build', gulp.series(gulp.parallel('clean:tmp', 'clean:packageLock', 'clean:dist'), 'scss', 'html','js','svg','fileinclude','fonts'));

gulp.task('default', gulp.series(gulp.parallel('fileinclude', 'scss'), gulp.parallel('browsersync', 'watch')));