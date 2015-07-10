"use strict";

var build = require("./build.js");

var gulp = require("gulp"),
    gutil = require("gulp-util");

try {
    var sass = require("gulp-sass");
} catch(err) {
    var sass = false;
}

try {
    var autoprefixer = require("gulp-autoprefixer");
} catch(err) {
    var autoprefixer = false;
}

try {
    var sourcemaps = require("gulp-sourcemaps");
} catch(err) {
    var sourcemaps = false;
}

var path = require("path");

var Style = {};

Style.sass = function(src_glob, dest_folder, options) {

    if (!sass) {
        console.error("gulp-sass is not installed");
        return;
    }

    options.autoprefix = options.autoprefix || false;
    options.entries = options.entries || src_glob;
    options.watch = options.watch || false;
    options.compress = options.compress || false;
    options.sourcemaps = options.sourcemaps || false;

    if (options.autoprefix && !autoprefixer) {
        console.error("gulp-autoprefixer is not installed, disable options.autoprefix or install it.");
        return;
    }

    if (options.sourcemaps && !sourcemaps) {
        console.error("gulp-sourcemaps is not installed, disabled options.sourcemaps or install it.");
        return;
    }

    function sassErrorHandler(e) {
        build.log("!style ", e.messageFormatted);

        var lines = e.message.split("\n");
        if ( lines.length > 1 ) {
            build.error(lines[ 0 ], lines[ 1 ]);
        }
    }

    function sassSuccessHandler(data) {
        var file_name = path.relative(__dirname, data.base);

        file_name = file_name.replace(/\.\.\//g, "");

        build.log("style ", gutil.colors.cyan( file_name ), "compiled");
    }

    function sassCompile() {
        gulp.src(options.entries)
            .pipe( options.sourcemaps ? sourcemaps.init() : gutil.noop() )

                .pipe(sass(
                    (options.compress ? {outputStyle: "compressed"} : {}))
                    .on( "error", sassErrorHandler ).on( "complete", sassSuccessHandler ))
                .pipe( options.autoprefix ? autoprefixer( options.autoprefix ) : gutil.noop() )

            .pipe( options.sourcemaps ? sourcemaps.write() : gutil.noop() )
            .pipe(gulp.dest(dest_folder).on("data", sassSuccessHandler));
    }

    sassCompile();

    if ( options.watch ) {
        gulp.watch(src_glob, sassCompile);
    }
};

module.exports = Style;
