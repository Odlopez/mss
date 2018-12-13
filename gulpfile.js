"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber"); //выводит в консоль сообщения об ошибке и не дает npm-ке прекратить работу из-за ошибки
var postcss = require("gulp-postcss"); //нужен для автопрефиксера
var autoprefixer = require("autoprefixer"); //сам автопрефиксер
var server = require("browser-sync").create(); //создает виртуальный сервер, перегружает браузер
var posthtml = require("gulp-posthtml"); //кажется, нужен для include
var include = require("posthtml-include"); //сам include svg-шек в разметку
var gulpBemCss = require('gulp-bem-css'); //создает бэм-блоки для лесс-файлов, вытаскивая бэм-дерево из разметки
var webp = require('gulp-webp'); //конвертирует изображения в формат webp
var run = require('run-sequence'); //нужен для запуска пачки тасков последовательно.
var rename = require("gulp-rename"); //переименовывает файлы
var del = require('del'); //удаляет файлы и папки
var csso = require('gulp-csso'); //минимизирует css
var svgstore = require('gulp-svgstore'); //создает svg-sprite
var svgmin = require('gulp-svgmin'); //минимизирует svg
var path = require('path'); //для gulp-less?
var imagemin = require('gulp-imagemin'); //оптимизирует графику
var htmlmin = require('gulp-htmlmin'); //минизирует html
var uglify = require('gulp-uglify'); //минизирует js
var pump = require('pump'); //нужен для работы gulp-uglify
const babel = require(`rollup-plugin-babel`);
const nodeResolve = require(`rollup-plugin-node-resolve`);
const rollup = require(`gulp-better-rollup`);
const sourcemaps = require(`gulp-sourcemaps`);
const commonjs = require(`rollup-plugin-commonjs`);

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("index.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]).on("change", server.reload);
  gulp.watch("source/js/*.js", ["scripts"]).on("change", server.reload);
});

gulp.task("copy", [`scripts`], function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/images/**",
    "source/php/*.php",
    "source/video/**",
    "source/audios/**",
    "source/vendor/**",
    "source/**/*.html",
    "source/**/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task('bem-scss', () => {
  return gulp.src('source/*.html')
    .pipe(gulpBemCss({
      folder: 'source/sass',
      extension: 'scss',
      elementSeparator: '__',
      modifierSeparator: '--'
    }))
    .pipe(gulp.dest('source'));
});

gulp.task('webp', () => {
  return gulp.src('source/images/**/*.{png,jpg}')
    .pipe(webp())
    .pipe(gulp.dest('source/images'))
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task('svg-optim', function () {
  return gulp.src('source/images/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('source/images'));
});

gulp.task("images-min", function () {
  return gulp.src("source/images/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/images"));
});

gulp.task("sprite", function() {
  return gulp.src("source/images/*.svg")
    .pipe(svgstore({
      inlineSvg: true
      }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/images"))
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task('minify', function () {
  return gulp.src('build/css/style.css')
      .pipe(csso())
      .pipe(gulp.dest('build/css'));
});

gulp.task('htmlmin', function() {
  return gulp.src("build/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
});

gulp.task("compress", function (cb) {
  pump([
      gulp.src("build/js/*.js"),
      uglify(),
      gulp.dest("build/js")
    ],
    cb
  );
});

gulp.task("copyjs", function () {
  return gulp.src([
      "source/js/**"
    ], {
      base: "source"
    })
  .pipe(gulp.dest("build"));
})

gulp.task("jsChange", function (done) {
  run(
    "copyjs",
    "compress",
    done
  );
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "sprite",
    "html",
    "htmlmin",
    "compress",
    done
  );
});

gulp.task(`scripts`, () => {
  return gulp.src(`source/js/main.js`).
    pipe(plumber()).
    pipe(sourcemaps.init()).
    pipe(rollup({
      plugins: [
        commonjs(),
        nodeResolve(),
        babel({
          babelrc: false,
          exclude: `node_modules/**`,
          presets: [`@babel/env`]
        }),
        uglify()
      ]
    }, `iife`)).
    pipe(sourcemaps.write(``)).
    pipe(plumber()).
    pipe(gulp.dest(`build/js/`));
});
