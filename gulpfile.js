// Modules & Plugins
var gulp = require('gulp');
var concat = require('gulp-concat');
var myth = require('gulp-myth');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var fileinclude = require('gulp-file-include');
// Styles Task
gulp.task('styles', function() {
    return gulp.src('assets/css/*.css')
        .pipe(concat('all.css'))
        .pipe(myth())
        .pipe(gulp.dest('dist'));
});

gulp.task('fileinclude', function() {
    return gulp.src('src/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src',
            indent:true
        }))
        .pipe(gulp.dest('dist'));
});


// Scripts Task
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Images Task
gulp.task('images', function() {
    return gulp.src('src/img/*')
        .pipe(gulp.dest('dist/img'));
});

// HTML Task
gulp.task('html', function() {
    return gulp.src('src/**/*')
        .pipe(imagemin())
        
        .pipe(gulp.dest('dist'));
});


// Watch Task
gulp.task('watch', function() {
    gulp.watch('src/css/*.css', gulp.series('styles'));
    gulp.watch('src/js/*.js', gulp.series('scripts'));
    gulp.watch('src/img/*', gulp.series('images'));
    gulp.watch('src/**/*.html', gulp.series('html'));
    gulp.watch('src/**', gulp.series('fileinclude'));
  });

// Default Task
gulp.task('default', gulp.parallel('styles', 'scripts', 'images', 'html','fileinclude','watch'));