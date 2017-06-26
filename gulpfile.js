/* File: gulpfile.js */
const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

// grab our gulp packages
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	gulpIf = require('gulp-if'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	htmlValid = require('gulp-html'),
	htmlMin = require('gulp-htmlmin'),
	eslint = require('gulp-eslint'),
	uglify = require('gulp-uglify'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	source = require("vinyl-source-stream"),
	buffer = require('vinyl-buffer'),
	cleanCSS = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	pngcrush = require('imagemin-pngcrush'),
	browserSync = require('browser-sync').create();

var env, gameCode,
	framework_manifest, gmae_manifest,
	htmlSources,
	jsSourceMain,
	jsSourcesInfra,
	jsSourcesGame,
	cssSources,
	imagesSources,
	outpotDir;

env = process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;
var protocol = process.env.PROTOCOL || "http";
var host = process.env.HOST || "localhost";
var port = process.env.PORT || env === PRODUCTION ? 3001 : 3005;
livereload_port = process.env.LIVE_RELOAD_PORT = process.env.LIVE_RELOAD_PORT || 3006;
gameCode = process.env.GAME_CODE = process.env.GAME_CODE || "Game_1";

if (env == DEVELOPMENT) {
	outpotDir = './build_development/' + gameCode;
} else {
	outpotDir = './build_production/' + gameCode;
}
console.log('setting gulp for ' + env + ' environment');


htmlSources = ['src_client/index.html'];
jsSourceMain = ['src_client/js/main_' + gameCode + '.js'];
jsSourcesInfra = ['src_client/js/infrastructure/**/*.js'];
jsSourcesGame = ['src_client/js/games/' + gameCode + '/**/*.js'];
cssSources = ['src_client/css/**/*.css'];
imagesSources = ['src_client/js/games/' + gameCode + '/assets/images/**/*.*'];

gulp.task('validateHTML', function() {
	return gulp.src(htmlSources)
		.pipe(plumber())
		.pipe(htmlValid());
});

gulp.task('minifyHTML', function() {
	return gulp.src(htmlSources)
		.pipe(gulpIf(env === PRODUCTION,
			htmlMin({
				collapseWhitespace: true
			})))
		.pipe(gulp.dest(outpotDir))
		.pipe(gulpIf(env === DEVELOPMENT,
			browserSync.stream({
				once: true
			})));
});

gulp.task('html', gulp.series(['validateHTML', 'minifyHTML']));

// configure the eslint task
gulp.task('eslint', function() {
	return gulp.src(['src_client/js/main_' + gameCode + '.js', 'src_client/js/infrastructure/**/*.js', 'src_client/js/games/' + gameCode + '/**/*.js'])
		.pipe(eslint({
			"rules": {
				"strict": 0
			},
			"parser": "babel-eslint"
		}))
		.pipe(eslint.format('stylish'));
});

gulp.task('jsbundle', function() {
	/*return gulp.src(jsSources)*/
	// .pipe(concat('bundle.js'))
	return browserify({
			entries: jsSourceMain,
			debug: env === DEVELOPMENT ? true : false
		})
		.transform(babelify.configure({
			presets: ["es2015"]
		}))
		.bundle()
		.on('error', function(err) {
			console.log(err);
			this.emit('end');
		})
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe(gulpIf(env === PRODUCTION, uglify()))
		.pipe(gulp.dest(outpotDir + '/js'))
		.pipe(gulpIf(env === DEVELOPMENT,
			browserSync.stream({
				once: true
			})));
});

gulp.task('js', gulp.series(['eslint', 'jsbundle']));

gulp.task('concatCss', function() {
	return gulp.src(cssSources)
		.pipe(concat('style.css'))
		.pipe(gulpIf(env === PRODUCTION, cleanCSS()))
		.pipe(gulp.dest(outpotDir + '/css'))
		.pipe(gulpIf(env === DEVELOPMENT,
			browserSync.stream({
				once: true
			})));;
});

gulp.task('css', gulp.series(['concatCss']));

gulp.task('imagemin', function() {
	return gulp.src(imagesSources)
		.pipe(gulpIf(env === PRODUCTION,
			imagemin({
				progressive: true,
				svgoPlugins: [{
					removeViewBox: false
				}],
				use: [pngcrush()]
			})))
		.pipe(gulp.dest(outpotDir + '/assets/images'))
		.pipe(gulpIf(env === DEVELOPMENT,
			browserSync.stream({
				once: true
			})));;
});

gulp.task('images', gulp.series(['imagemin']));


// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function(done) {
	if (env === PRODUCTION) {
		done();
		return;
	}
	browserSync.init({
		server: outpotDir,
		port: livereload_port
	});
	gulp.watch(htmlSources, gulp.series(['html']));
	gulp.watch([jsSourceMain, jsSourcesInfra, jsSourcesGame], gulp.series(['js']));
	gulp.watch(cssSources, gulp.series(['css']));
	gulp.watch(imagesSources, gulp.series(['images']));
});

gulp.task('default', gulp.series(
	gulp.parallel(
		['html', 'js', 'css', 'images']
	), ['watch']));