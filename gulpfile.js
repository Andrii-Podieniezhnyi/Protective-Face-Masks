const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");

// Шляхи
const paths = {
  scss: "src/scss/**/*.scss",
  html: "src/**/*.html",
  images: "src/images/**/*",
  dist: "dist/"
};

// SCSS -> CSS
function styles() {
  return src("src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(dest(paths.dist + "css"))
    .pipe(browserSync.stream());
}

// HTML
function html() {
  return src(paths.html)
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}

// Images
function images() {
  return src(paths.images)
    .pipe(dest(paths.dist + "images"))
    .pipe(browserSync.stream());
}

// JS (поки простий, просто копіює)
function scripts() {
  return src("src/js/**/*.js")
    .pipe(concat("main.js"))
    // .pipe(uglify()) // якщо захочеш мінімізувати
    .pipe(dest(paths.dist + "js"))
    .pipe(browserSync.stream());
}

// Сервер
function serve() {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });

  watch(paths.scss, styles);
  watch(paths.html, html);
  watch(paths.images, images);
  watch("src/js/**/*.js", scripts);
}

// Tasks
exports.styles = styles;
exports.html = html;
exports.images = images;
exports.scripts = scripts;
exports.serve = serve;

exports.default = series(
  parallel(styles, html, images, scripts),
  serve
);

exports.build = series(
  parallel(styles, html, images, scripts)
);