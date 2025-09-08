const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
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
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(dest(paths.dist + "css"))
    .pipe(browserSync.stream());
}


function html() {
  return src(paths.html)
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}


function images() {
  return src(paths.images, {encoding: false})
    .pipe(dest(paths.dist + "images"))
}


function scripts() {
  return src("src/js/**/*.js")
    .pipe(concat("main.js"))
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