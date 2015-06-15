"use strict";

var build = require("./build.js");

var gulp = require("gulp"),
    gutil = require("gulp-util");

var imagemin = require("gulp-imagemin");

var Images = {};

Images.compress = function(src_globs, dest_folder, label) {
    label = label || build.globsToString(src_globs);

    var compressComplete = function() {
        build.log( "images",
            gutil.colors.cyan( label ),
            "compressed, copied to",
            gutil.colors.cyan( dest_folder ) );
    };

    gulp.src( src_globs )
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            optimisationLevel: 3
        }))
        .pipe( gulp.dest( dest_folder ).on("finish", compressComplete) );
};

module.exports = Images;
