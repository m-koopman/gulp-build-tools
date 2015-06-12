var build = require('./build.js');

var gulp = require('gulp'),
    gutil = require('gulp-util');

var sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps');

var path = require('path');

var Style = {};

function sassErrorHandler(e) {
    build.log("!style ", e.messageFormatted);

    var lines = e.message.split("\n");
    if ( lines.length > 1 ) {
        build.error(lines[ 0 ], lines[ 1 ]);
    }
}

function sassSuccessHandler(data) {
    var file_name = path.relative(__dirname, data.base);

    file_name = file_name.replace(/..\//g, "");

    build.log("style ", gutil.colors.cyan( file_name ), "compiled");
}

Style.sass = function(src_glob, dest_folder, options) {
    options.autoprefix = options.autoprefix || false;
    options.entries = options.entries || src_glob;
    options.watch = options.watch || false;
    options.compress = options.compress || false;
    options.sourcemaps = options.sourcemaps || false;

    function compileSass() {
        gulp.src(options.entries)
            .pipe( options.sourcemaps ? sourcemaps.init() : gutil.noop() )

                .pipe(sass(
                    (options.compress ? {outputStyle: 'compressed'} : {}))
                    .on( 'error', sassErrorHandler ).on( 'complete', sassSuccessHandler ))
                .pipe( options.autoprefix ? autoprefixer( options.autoprefix ) : gutil.noop() )

            .pipe( options.sourcemaps ? sourcemaps.write() : gutil.noop() )
            .pipe(gulp.dest(dest_folder).on('data', sassSuccessHandler));
    }

    compileSass();

    if ( options.watch ) {
        gulp.watch(src_glob, compileSass);
    }
}

module.exports = Style;
