var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename'); 
var uglify = require('gulp-uglify');
var gulpSequence = require('gulp-sequence');
var autoPrefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var htmlReporter = require('gulp-csslint-report');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

//plumber error 
var onError = function (err) {
  console.log(err);
};

//create sourcemaps, convert scss to css, lint check, minify and prefix
gulp.task('css', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(csslint())
        .pipe(htmlReporter())
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoPrefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
});


//create sourcemaps, lint check, compile into one file, minify
gulp.task('js', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('gulp-jshint-html-reporter', {
        filename: __dirname + '/jshint-output.html',
        createMissingFolders : false  
    }))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
});                                                                            

//copy php files to app
gulp.task('phpCopy', function(){
    return gulp.src('app/*.php')
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(gulp.dest('dist'));
});

//functions to run on file save
gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', ['css']);
    gulp.watch('app/*.php', ['phpCopy']);
    gulp.watch('app/js/**/*.js', ['js']);
});

gulp.task('default', ['css', 'js', 'phpCopy']);