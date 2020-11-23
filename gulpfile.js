var gulp = require('gulp');
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sync = require("browser-sync").create();
var htmlmin = require("gulp-htmlmin");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var csso = require("gulp-csso");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var del = require("del");

//HTML

var html = function() {
	return gulp.src("source/*.html")
		.pipe(posthtml([include()]))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest("build"));
}

// Styles

var styles = function() {
	return gulp.src("source/less/style.less")
		.pipe(plumber())
		.pipe(sourcemap.init())
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(gulp.dest("build/css"))
		.pipe(csso())
		.pipe(rename("styles.min.css"))
		.pipe(sourcemap.write("."))
		.pipe(gulp.dest("build/css"))
		.pipe(sync.stream());
}

//JS

var js = function() {
	return gulp.src("source/js/**/*.js")
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest("build/js"));
};

//Images

var images = function() {
	return gulp.src("source/img/**/*.{jpg,png,svg}")
		.pipe(imagemin([
			imagemin.optipng({
				optimizationLevel: 3
			}),
			imagemin.mozjpeg({
				progressive: true
			}),
			imagemin.svgo()
		]))
}

//webp

var createWebp = function() {
	return gulp.src("source/img/**/*.{png,jpg}")
		.pipe(webp({
			quality: 90
		}))
		.pipe(gulp.dest("build/img"))
}

//Clean

var clean = function() {
	return del("build");
};

//Copy

var copy = function() {
	return gulp.src([
			"source/fonts/**",
			"source/img/**",
			"source/js/**",
			"source/*.html"
		], {
			base: "source"
		})
		.pipe(gulp.dest("build"));
};

//Build

var build = gulp.series(
	clean,
	copy,
	html,
	styles,
	images,
	js,
	createWebp
);

exports.build = build;

// Server

var server = (done) => {
	sync.init({
		server: {
			baseDir: "build"
		},
		cors: true,
		notify: false,
		ui: false,
	});
	done();
}

// Watcher

var watcher = function() {
	gulp.watch("source/less/**/*.less", gulp.series(styles));
	gulp.watch("source/*.html", gulp.series(html));
}

exports.default = gulp.series(
	build, styles, server, watcher
);
