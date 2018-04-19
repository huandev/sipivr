var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var flatmap = require('gulp-flatmap');
var path = require('path');
var rollup = require('gulp-rollup');
var typescriptPlugin = require("rollup-plugin-typescript");
var typescript= require("typescript");
var rename = require("gulp-rename");
var clean = require('gulp-clean');

var src = "./src";
var output = "../scripts";
// var output = "C:/Program Files/FreeSWITCH/scripts";
//npm run build

gulp.task('typescript', function (done) {
  return gulp.src([src + '/**/*.ts', '!' + src + '/**/*.d.ts'])
	.pipe(plumber({ errorHandler: done }))
    .pipe(flatmap(function(stream, file){
        var relativePath = path.relative(file.cwd, file.path);
        var baseName = path.basename(file.path);
        gutil.log(relativePath);
        return gulp.src(src + '/**/*.ts')
        .pipe(rollup({
            entry: relativePath,
            format: "iife",
            sourcemap: true,
            name: "sipivr",
            plugins: [
                typescriptPlugin({
                    typescript: typescript
                }),
            ],
        }));
    })).pipe(gulp.dest(output));
});

gulp.task('javascript', function (done) {
    return gulp.src([src + '/**/*.js'])
        .pipe(gulp.dest(output));
});

gulp.task('rename', ['typescript', 'javascript'], function () {
    return gulp.src(output + "/**/*.ts")
    .pipe(rename(function (path) {
		path.basename += ".ts";
        path.extname = ".js"
    }))
    .pipe(gulp.dest(output)); 
});

gulp.task('clean', ['rename'], function () {
    return gulp.src(output + "/**/*.ts")
        .pipe(clean({
            read: false,
            force: true
        }));
});

gulp.task('default', function() {
    return gulp.watch([src + '/**/*.ts', src + '/**/*.js'], ['clean']);
});