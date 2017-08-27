var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var coffeescript = require('gulp-coffeescript');

gulp.task("coffee", function() {
  gulp.src('src/**/*.coffee')
    .pipe(coffeescript({bare: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task("json", function() {
  gulp.src('src/**/*.json')
    .pipe(gulp.dest('dist'));
});

gulp.task("default", ['coffee', 'json'], function () {

  var tsResult = gulp.src('src/**/*.ts')
    .pipe(tsProject());

  return tsResult
    .pipe(gulp.dest("dist"));
});